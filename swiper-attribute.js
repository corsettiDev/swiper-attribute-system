/**
 * Webflow Attribute-Based Swiper System
 * =====================================
 *
 * A reusable, attribute-driven SwiperJS implementation for Webflow that:
 * - Uses data attributes instead of hardcoded Swiper class names
 * - Prevents styling conflicts with Webflow's Designer
 * - Supports dynamic configuration via HTML attributes
 * - Works with Webflow CMS collection lists
 * - Handles dynamic content with MutationObserver
 * - Flexible element placement for pagination/navigation (sibling or child)
 *
 * HTML STRUCTURE FLEXIBILITY:
 * ===========================
 * Pagination and navigation elements can be placed in two ways:
 *
 * OPTION 1 - Traditional (nested inside container):
 * [data-swiper="component"]
 *   └── [data-swiper="container"]
 *         ├── [data-swiper="wrapper"]
 *         │     └── [data-swiper="slide"] (repeated)
 *         ├── [data-swiper="pagination"]
 *         ├── [data-swiper="nav-prev"]
 *         └── [data-swiper="nav-next"]
 *
 * OPTION 2 - CMS Compatible (siblings to container):
 * [data-swiper="component"]
 *   ├── [data-swiper="container"] (can be Collection List)
 *   │     └── [data-swiper="wrapper"] (Collection List Wrapper)
 *   │           └── [data-swiper="slide"] (Collection Items)
 *   ├── [data-swiper="pagination"]
 *   ├── [data-swiper="nav-prev"]
 *   └── [data-swiper="nav-next"]
 *
 * Option 2 is essential for Webflow CMS Collection Lists, which cannot
 * have static child elements added inside them in the Designer.
 *
 * @requires SwiperJS bundle (swiper-bundle.min.js)
 * @version 1.1.0
 */

(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  /**
   * Default Swiper configuration
   * These values are used unless overridden by data attributes
   */
  const DEFAULT_CONFIG = {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: false,
    speed: 400,
    // Pagination and navigation will be added dynamically if elements exist
  };

  /**
   * Attribute selectors for component discovery
   */
  const SELECTORS = {
    component: '[data-swiper="component"]',
    container: '[data-swiper="container"]',
    wrapper: '[data-swiper="wrapper"]',
    slide: '[data-swiper="slide"]',
    pagination: '[data-swiper="pagination"]',
    navPrev: '[data-swiper="nav-prev"]',
    navNext: '[data-swiper="nav-next"]',
  };

  /**
   * Swiper class names to be added programmatically
   */
  const SWIPER_CLASSES = {
    container: 'swiper',
    wrapper: 'swiper-wrapper',
    slide: 'swiper-slide',
    pagination: 'swiper-pagination',
    navPrev: 'swiper-button-prev',
    navNext: 'swiper-button-next',
  };

  /**
   * Data attribute prefix for configuration options
   */
  const CONFIG_ATTR_PREFIX = 'data-swiper-';

  /**
   * Attribute to mark initialized components (prevents double initialization)
   */
  const INITIALIZED_ATTR = 'data-swiper-initialized';

  /**
   * Webflow's standard breakpoints (mobile-first approach)
   * These match Webflow Designer's responsive breakpoints
   */
  const WEBFLOW_BREAKPOINTS = {
    mobileLandscape: 480,  // 480px and up = Mobile Landscape
    tablet: 768,           // 768px and up = Tablet
    desktop: 992,          // 992px and up = Desktop
    // Mobile Portrait is 0-479px (default/base config)
  };

  /**
   * Breakpoint suffixes that can be used in attributes
   * Example: data-swiper-slides-per-view-tablet="2"
   */
  const BREAKPOINT_SUFFIXES = ['mobile-portrait', 'mobile-landscape', 'tablet', 'desktop'];

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Converts kebab-case to camelCase
   * Example: "slides-per-view" → "slidesPerView"
   */
  function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  /**
   * Safely parses JSON strings with error handling
   */
  function safeJSONParse(str, fallback = null) {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.warn('[Swiper Attribute] Invalid JSON:', str, e);
      return fallback;
    }
  }

  /**
   * Converts string values to appropriate types
   * Handles: "true"/"false" → boolean, numbers → number, JSON → object
   */
  function parseValue(value) {
    // Handle boolean strings
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Handle numbers
    if (/^\d+$/.test(value)) return parseInt(value, 10);
    if (/^\d+\.\d+$/.test(value)) return parseFloat(value);

    // Handle JSON objects/arrays
    if ((value.startsWith('{') && value.endsWith('}')) ||
        (value.startsWith('[') && value.endsWith(']'))) {
      return safeJSONParse(value, value);
    }

    // Return as string
    return value;
  }

  /**
   * Deep merges two objects (used for configuration merging)
   */
  function deepMerge(target, source) {
    const output = { ...target };

    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }

    return output;
  }

  /**
   * Checks if value is a plain object
   */
  function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Logs messages with consistent formatting
   */
  function log(message, type = 'info', data = null) {
    const prefix = '[Swiper Attribute]';
    const styles = {
      info: 'color: #3b82f6',
      success: 'color: #10b981',
      warn: 'color: #f59e0b',
      error: 'color: #ef4444',
    };

    if (type === 'error') {
      console.error(`${prefix} ${message}`, data || '');
    } else if (type === 'warn') {
      console.warn(`${prefix} ${message}`, data || '');
    } else {
      console.log(`%c${prefix} ${message}`, styles[type] || '', data || '');
    }
  }

  /**
   * Builds Swiper breakpoints configuration from Webflow-specific attributes
   *
   * Supports attributes like:
   * - data-swiper-slides-per-view-desktop="3"
   * - data-swiper-slides-per-view-tablet="2"
   * - data-swiper-space-between-mobile-landscape="16"
   *
   * These are automatically converted to Swiper's breakpoints format using
   * Webflow's standard breakpoint values (480, 768, 992).
   *
   * @param {HTMLElement} component - The component container element
   * @param {Object} baseConfig - Base configuration to use for defaults
   * @returns {Object} Breakpoints object for Swiper config
   */
  function buildBreakpointsFromAttributes(component, baseConfig) {
    const breakpointsConfig = {};
    const breakpointData = {
      'mobile-landscape': {},
      'tablet': {},
      'desktop': {}
    };

    // Scan all attributes for breakpoint-specific settings
    const attributes = component.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      const attrName = attr.name;
      const attrValue = attr.value;

      if (!attrName.startsWith(CONFIG_ATTR_PREFIX)) continue;

      // Check if this attribute has a breakpoint suffix
      let breakpointFound = null;
      let configName = null;

      for (const suffix of BREAKPOINT_SUFFIXES) {
        if (attrName.endsWith(`-${suffix}`)) {
          breakpointFound = suffix;
          // Extract the config name without the breakpoint suffix
          // Example: "data-swiper-slides-per-view-tablet" → "slides-per-view"
          const withoutPrefix = attrName.replace(CONFIG_ATTR_PREFIX, '');
          configName = withoutPrefix.replace(`-${suffix}`, '');
          break;
        }
      }

      if (breakpointFound && configName) {
        // Skip mobile-portrait as it's the default/base config
        if (breakpointFound === 'mobile-portrait') {
          continue;
        }

        // Convert to camelCase for Swiper config
        const camelConfigName = kebabToCamel(configName);

        // Parse the value
        const parsedValue = parseValue(attrValue);

        // Store in the appropriate breakpoint
        breakpointData[breakpointFound][camelConfigName] = parsedValue;
      }
    }

    // Build final breakpoints object using Webflow's breakpoint values
    if (Object.keys(breakpointData['mobile-landscape']).length > 0) {
      breakpointsConfig[WEBFLOW_BREAKPOINTS.mobileLandscape] = breakpointData['mobile-landscape'];
    }

    if (Object.keys(breakpointData['tablet']).length > 0) {
      breakpointsConfig[WEBFLOW_BREAKPOINTS.tablet] = breakpointData['tablet'];
    }

    if (Object.keys(breakpointData['desktop']).length > 0) {
      breakpointsConfig[WEBFLOW_BREAKPOINTS.desktop] = breakpointData['desktop'];
    }

    return Object.keys(breakpointsConfig).length > 0 ? breakpointsConfig : null;
  }

  // ============================================================================
  // CORE FUNCTIONALITY
  // ============================================================================

  /**
   * Parses configuration from data attributes on the component element
   * Supports any Swiper option via kebab-case attributes
   *
   * @param {HTMLElement} component - The component container element
   * @returns {Object} Configuration object for Swiper
   */
  function parseConfiguration(component) {
    const config = { ...DEFAULT_CONFIG };
    const attributes = component.attributes;

    // Iterate through all attributes on the component
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      const attrName = attr.name;
      const attrValue = attr.value;

      // Only process swiper configuration attributes
      if (attrName.startsWith(CONFIG_ATTR_PREFIX) &&
          attrName !== 'data-swiper' &&
          attrName !== INITIALIZED_ATTR) {

        // Skip breakpoint-specific attributes (they're handled separately)
        let isBreakpointAttr = false;
        for (const suffix of BREAKPOINT_SUFFIXES) {
          if (attrName.endsWith(`-${suffix}`)) {
            isBreakpointAttr = true;
            break;
          }
        }
        if (isBreakpointAttr) continue;

        // Convert attribute name to camelCase config key
        // Example: "data-swiper-slides-per-view" → "slidesPerView"
        const configKey = kebabToCamel(
          attrName.replace(CONFIG_ATTR_PREFIX, '')
        );

        // Parse and set the value
        config[configKey] = parseValue(attrValue);
      }
    }

    // Build breakpoints from Webflow-specific attributes
    const breakpointsFromAttrs = buildBreakpointsFromAttributes(component, config);
    if (breakpointsFromAttrs) {
      // Merge with any existing breakpoints config
      config.breakpoints = config.breakpoints
        ? deepMerge(config.breakpoints, breakpointsFromAttrs)
        : breakpointsFromAttrs;
    }

    return config;
  }

  /**
   * Adds Swiper classes to elements within a component
   * This allows Webflow designers to style elements freely without
   * worrying about Swiper's required class names
   *
   * FLEXIBLE ELEMENT PLACEMENT:
   * Pagination and navigation elements can be placed in two ways:
   * 1. As children of the container (traditional approach)
   * 2. As children of the component (sibling to container) - for CMS Collection Lists
   *
   * The second approach is necessary when using Webflow CMS Collection Lists as the
   * container, since Collection Lists cannot have static child elements added inside them.
   *
   * @param {HTMLElement} component - The component container element
   * @returns {Object} Object containing references to all Swiper elements
   */
  function prepareSwiperElements(component) {
    const elements = {};

    // Find container (required)
    elements.container = component.querySelector(SELECTORS.container);
    if (!elements.container) {
      throw new Error('Swiper container element not found. Add [data-swiper="container"] to your slider element.');
    }

    // Find wrapper (required)
    elements.wrapper = elements.container.querySelector(SELECTORS.wrapper);
    if (!elements.wrapper) {
      throw new Error('Swiper wrapper element not found. Add [data-swiper="wrapper"] to your slides container.');
    }

    // Find slides (required)
    elements.slides = elements.wrapper.querySelectorAll(SELECTORS.slide);
    if (elements.slides.length === 0) {
      throw new Error('No slides found. Add [data-swiper="slide"] to your slide elements.');
    }

    // Find pagination (optional)
    // Search within component scope to support both placement options:
    // - Child of container (nested inside)
    // - Child of component (sibling to container) - for CMS Collection Lists
    elements.pagination = component.querySelector(SELECTORS.pagination);

    // Find navigation buttons (optional)
    // Same flexible placement as pagination
    elements.navPrev = component.querySelector(SELECTORS.navPrev);
    elements.navNext = component.querySelector(SELECTORS.navNext);

    // Add Swiper classes to elements
    elements.container.classList.add(SWIPER_CLASSES.container);
    elements.wrapper.classList.add(SWIPER_CLASSES.wrapper);

    elements.slides.forEach(slide => {
      slide.classList.add(SWIPER_CLASSES.slide);
    });

    if (elements.pagination) {
      elements.pagination.classList.add(SWIPER_CLASSES.pagination);
    }

    if (elements.navPrev) {
      elements.navPrev.classList.add(SWIPER_CLASSES.navPrev);
    }

    if (elements.navNext) {
      elements.navNext.classList.add(SWIPER_CLASSES.navNext);
    }

    return elements;
  }

  /**
   * Builds the final Swiper configuration by merging:
   * 1. Default configuration
   * 2. User-defined attributes
   * 3. Dynamic pagination/navigation setup
   *
   * IMPORTANT: Uses element references instead of CSS selectors.
   * This is critical for flexible element placement where pagination/navigation
   * can be siblings to the container (for CMS setups) or children of it.
   *
   * @param {Object} parsedConfig - Configuration from data attributes
   * @param {Object} elements - References to Swiper elements
   * @returns {Object} Final Swiper configuration
   */
  function buildSwiperConfig(parsedConfig, elements) {
    const config = { ...parsedConfig };

    // Add pagination configuration if element exists
    // Use element reference instead of selector to support flexible placement
    if (elements.pagination) {
      config.pagination = deepMerge(
        {
          el: elements.pagination, // Pass element directly, not selector
          clickable: true,
        },
        config.pagination || {}
      );
    }

    // Add navigation configuration if elements exist
    // Use element references instead of selectors to support flexible placement
    if (elements.navPrev && elements.navNext) {
      config.navigation = deepMerge(
        {
          prevEl: elements.navPrev, // Pass element directly, not selector
          nextEl: elements.navNext, // Pass element directly, not selector
        },
        config.navigation || {}
      );
    }

    // Handle autoplay configuration
    // If autoplay is set to true, use default autoplay settings
    if (config.autoplay === true) {
      config.autoplay = {
        delay: 3000,
        disableOnInteraction: false,
      };
    }

    return config;
  }

  /**
   * Initializes a single Swiper component
   *
   * @param {HTMLElement} component - The component container element
   * @returns {Swiper|null} Swiper instance or null if initialization fails
   */
  function initializeSwiperComponent(component) {
    try {
      // Check if already initialized
      if (component.hasAttribute(INITIALIZED_ATTR)) {
        log('Component already initialized, skipping.', 'warn');
        return null;
      }

      // Verify Swiper library is loaded
      if (typeof Swiper === 'undefined') {
        throw new Error('SwiperJS library not found. Please include swiper-bundle.min.js before this script.');
      }

      // Parse configuration from data attributes
      const parsedConfig = parseConfiguration(component);

      // Prepare elements and add Swiper classes
      const elements = prepareSwiperElements(component);

      // Build final configuration
      const swiperConfig = buildSwiperConfig(parsedConfig, elements);

      // Log configuration for debugging
      log('Initializing with config:', 'info', swiperConfig);
      if (swiperConfig.breakpoints) {
        log('Breakpoints detected:', 'info', swiperConfig.breakpoints);
      }

      // Initialize Swiper
      const swiperInstance = new Swiper(elements.container, swiperConfig);

      // Mark as initialized
      component.setAttribute(INITIALIZED_ATTR, 'true');

      // Store instance reference on the component
      component.swiperInstance = swiperInstance;

      log('Swiper initialized successfully', 'success', {
        config: swiperConfig,
        slideCount: elements.slides.length,
      });

      return swiperInstance;

    } catch (error) {
      log(`Initialization failed: ${error.message}`, 'error', error);
      return null;
    }
  }

  /**
   * Initializes all Swiper components on the page
   *
   * @returns {Array} Array of initialized Swiper instances
   */
  function initializeAllSwipers() {
    const components = document.querySelectorAll(SELECTORS.component);

    if (components.length === 0) {
      log('No Swiper components found on page.', 'info');
      return [];
    }

    log(`Found ${components.length} Swiper component(s), initializing...`, 'info');

    const instances = [];
    components.forEach((component, index) => {
      log(`Initializing component ${index + 1}/${components.length}`, 'info');
      const instance = initializeSwiperComponent(component);
      if (instance) {
        instances.push(instance);
      }
    });

    log(`Successfully initialized ${instances.length} Swiper(s)`, 'success');
    return instances;
  }

  /**
   * Destroys a Swiper instance and removes initialization marker
   * Useful for cleanup or reinitialization
   *
   * @param {HTMLElement} component - The component to destroy
   */
  function destroySwiperComponent(component) {
    if (component.swiperInstance) {
      component.swiperInstance.destroy(true, true);
      component.removeAttribute(INITIALIZED_ATTR);
      delete component.swiperInstance;
      log('Swiper instance destroyed', 'info');
    }
  }

  /**
   * Reinitializes a specific Swiper component
   * Useful when content changes or configuration updates
   *
   * @param {HTMLElement} component - The component to reinitialize
   * @returns {Swiper|null} New Swiper instance
   */
  function reinitializeSwiperComponent(component) {
    destroySwiperComponent(component);
    return initializeSwiperComponent(component);
  }

  // ============================================================================
  // MUTATION OBSERVER (Dynamic Content Support)
  // ============================================================================

  /**
   * Sets up MutationObserver to handle dynamically added Swiper components
   * This is essential for Webflow CMS collection lists that load via AJAX
   * or any dynamic content injection
   */
  function setupMutationObserver() {
    // Check if MutationObserver is supported
    if (typeof MutationObserver === 'undefined') {
      log('MutationObserver not supported in this browser. Dynamic content detection disabled.', 'warn');
      return;
    }

    const observer = new MutationObserver((mutations) => {
      let hasNewComponents = false;

      mutations.forEach((mutation) => {
        // Check added nodes for new Swiper components
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check if the node itself is a component
            if (node.matches && node.matches(SELECTORS.component)) {
              if (!node.hasAttribute(INITIALIZED_ATTR)) {
                hasNewComponents = true;
              }
            }
            // Check if the node contains components
            else if (node.querySelectorAll) {
              const components = node.querySelectorAll(SELECTORS.component);
              components.forEach((component) => {
                if (!component.hasAttribute(INITIALIZED_ATTR)) {
                  hasNewComponents = true;
                }
              });
            }
          }
        });
      });

      // Initialize new components if found
      if (hasNewComponents) {
        log('New Swiper components detected, initializing...', 'info');
        initializeAllSwipers();
      }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    log('MutationObserver enabled for dynamic content detection', 'success');
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Main initialization function
   * Runs when DOM is ready and sets up all Swiper components
   */
  function init() {
    log('Initializing Webflow Attribute-Based Swiper System...', 'info');

    // Initialize all existing components
    const instances = initializeAllSwipers();

    // Set up mutation observer for dynamic content
    setupMutationObserver();

    // Expose instances globally for debugging
    window.swiperInstances = instances;

    log('System initialization complete', 'success');
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Expose public API for manual control
   */
  window.WebflowSwiper = {
    /**
     * Initialize all Swiper components on the page
     */
    init: initializeAllSwipers,

    /**
     * Initialize a specific component
     * @param {HTMLElement|string} componentOrSelector - Element or selector
     */
    initComponent: function(componentOrSelector) {
      const component = typeof componentOrSelector === 'string'
        ? document.querySelector(componentOrSelector)
        : componentOrSelector;

      if (!component) {
        log('Component not found', 'error');
        return null;
      }

      return initializeSwiperComponent(component);
    },

    /**
     * Destroy a specific component
     * @param {HTMLElement|string} componentOrSelector - Element or selector
     */
    destroyComponent: function(componentOrSelector) {
      const component = typeof componentOrSelector === 'string'
        ? document.querySelector(componentOrSelector)
        : componentOrSelector;

      if (!component) {
        log('Component not found', 'error');
        return;
      }

      destroySwiperComponent(component);
    },

    /**
     * Reinitialize a specific component
     * @param {HTMLElement|string} componentOrSelector - Element or selector
     */
    reinitComponent: function(componentOrSelector) {
      const component = typeof componentOrSelector === 'string'
        ? document.querySelector(componentOrSelector)
        : componentOrSelector;

      if (!component) {
        log('Component not found', 'error');
        return null;
      }

      return reinitializeSwiperComponent(component);
    },

    /**
     * Get all active Swiper instances
     */
    getInstances: function() {
      return window.swiperInstances || [];
    },

    /**
     * Get Swiper instance from a component
     * @param {HTMLElement|string} componentOrSelector - Element or selector
     */
    getInstance: function(componentOrSelector) {
      const component = typeof componentOrSelector === 'string'
        ? document.querySelector(componentOrSelector)
        : componentOrSelector;

      return component ? component.swiperInstance : null;
    }
  };

  // ============================================================================
  // AUTO-INITIALIZATION
  // ============================================================================

  // Wait for DOM to be ready before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM is already ready, initialize immediately
    init();
  }

})();
