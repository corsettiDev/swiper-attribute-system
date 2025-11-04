# System Architecture

## Overview

The Webflow Swiper Attribute System is a lightweight JavaScript library that bridges SwiperJS with Webflow's visual Designer through a data-attribute architecture.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Webflow Project                         │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Custom Code (Head)                      │ │
│  │  • Swiper CSS (CDN)                                       │ │
│  │  • swiper-attribute.css                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  Webflow Designer                          │ │
│  │                                                            │ │
│  │  [Div] data-swiper="component"                            │ │
│  │    data-swiper-loop="true"                                │ │
│  │    data-swiper-slides-per-view="3"                        │ │
│  │    │                                                       │ │
│  │    └── [Div] data-swiper="container"                      │ │
│  │         │                                                  │ │
│  │         ├── [Div] data-swiper="wrapper"                   │ │
│  │         │    ├── [Div] data-swiper="slide"                │ │
│  │         │    ├── [Div] data-swiper="slide"                │ │
│  │         │    └── [Div] data-swiper="slide"                │ │
│  │         │                                                  │ │
│  │         ├── [Div] data-swiper="pagination"                │ │
│  │         ├── [Div] data-swiper="nav-prev"                  │ │
│  │         └── [Div] data-swiper="nav-next"                  │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                 Custom Code (Footer)                       │ │
│  │  • Swiper JS Library (CDN)                                │ │
│  │  • swiper-attribute.js ─────┐                             │ │
│  └─────────────────────────────│───────────────────────────┘ │
│                                │                               │
└────────────────────────────────│───────────────────────────────┘
                                 │
                                 │ Auto-initialization
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Swiper Attribute System Runtime                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. DOM Ready Detection                                  │  │
│  │     • DOMContentLoaded listener                          │  │
│  │     • Immediate execution if already loaded              │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                             │
│                   ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  2. Component Discovery                                  │  │
│  │     • Query all [data-swiper="component"]               │  │
│  │     • Filter already initialized (data-swiper-initialized)│ │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                             │
│                   ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  3. Element Preparation (for each component)            │  │
│  │     • Find container, wrapper, slides                    │  │
│  │     • Find optional pagination, navigation              │  │
│  │     • Validate required elements exist                   │  │
│  │     • Add Swiper CSS classes programmatically:          │  │
│  │       - .swiper, .swiper-wrapper, .swiper-slide         │  │
│  │       - .swiper-pagination, .swiper-button-*            │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                             │
│                   ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  4. Configuration Parsing                                │  │
│  │     • Extract all data-swiper-* attributes              │  │
│  │     • Convert kebab-case to camelCase                   │  │
│  │     • Parse values (string → boolean/number/object)     │  │
│  │     • Merge with defaults                               │  │
│  │     • Add pagination/navigation configs if elements exist│  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                             │
│                   ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  5. Swiper Initialization                                │  │
│  │     • new Swiper(container, config)                     │  │
│  │     • Store instance on component element               │  │
│  │     • Mark as initialized                               │  │
│  │     • Add to global instances array                     │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                             │
│                   ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  6. Dynamic Content Watching                             │  │
│  │     • MutationObserver on document.body                 │  │
│  │     • Detect new components added to DOM                │  │
│  │     • Auto-initialize new components                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Attributes → Parser → Config Object → Swiper Instance
     ↓
[data-swiper-loop="true"]
     ↓
kebabToCamel("loop")
     ↓
parseValue("true") = boolean true
     ↓
{ loop: true }
     ↓
new Swiper(element, { loop: true })
```

## Component Lifecycle

```
┌──────────────┐
│   Created    │  Component exists in DOM with data-swiper attributes
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Discovered  │  System finds component via querySelector
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Prepared   │  Elements validated, CSS classes added
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Configured  │  Attributes parsed into Swiper config
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Initialized  │  Swiper instance created and active
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Active     │  Slider functional, responds to interactions
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Destroyed   │  Optional: destroy() called, cleanup performed
└──────────────┘
```

## Module Structure

### Core Modules

```
swiper-attribute.js
├── Configuration
│   ├── DEFAULT_CONFIG
│   ├── SELECTORS
│   ├── SWIPER_CLASSES
│   └── CONFIG_ATTR_PREFIX
│
├── Utility Functions
│   ├── kebabToCamel()      - String conversion
│   ├── safeJSONParse()     - Safe JSON parsing
│   ├── parseValue()        - Type conversion
│   ├── deepMerge()         - Object merging
│   ├── isObject()          - Type checking
│   └── log()               - Consistent logging
│
├── Core Functionality
│   ├── parseConfiguration()        - Extract config from attributes
│   ├── prepareSwiperElements()     - Add classes to elements
│   ├── buildSwiperConfig()         - Build final config object
│   ├── initializeSwiperComponent() - Initialize single component
│   ├── initializeAllSwipers()      - Initialize all components
│   ├── destroySwiperComponent()    - Destroy single component
│   └── reinitializeSwiperComponent() - Reinit single component
│
├── Dynamic Content Support
│   └── setupMutationObserver()    - Watch for new components
│
├── Initialization
│   └── init()                     - Main entry point
│
└── Public API
    └── window.WebflowSwiper
        ├── init()
        ├── initComponent()
        ├── destroyComponent()
        ├── reinitComponent()
        ├── getInstances()
        └── getInstance()
```

## Configuration Resolution

The system uses a three-layer configuration system:

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Runtime Overrides (Highest Priority)             │
│  Example: Individual attribute overrides                    │
│  data-swiper-speed="800"                                   │
└────────────────────┬────────────────────────────────────────┘
                     │ Overrides ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Component Attributes (Medium Priority)           │
│  Example: All data-swiper-* attributes on component        │
│  data-swiper-loop="true"                                   │
│  data-swiper-slides-per-view="3"                           │
└────────────────────┬────────────────────────────────────────┘
                     │ Overrides ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Default Configuration (Lowest Priority)          │
│  Defined in: DEFAULT_CONFIG                                │
│  { slidesPerView: 1, spaceBetween: 16, ... }              │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────┐
│ User Action     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│ Try Operation   │──X──→│ Catch Error      │
└────────┬────────┘      └────────┬─────────┘
         │                        │
         │ Success                │ Error
         ▼                        ▼
┌─────────────────┐      ┌──────────────────┐
│ Log Success     │      │ Log Error        │
│ Return Instance │      │ Return null      │
└─────────────────┘      │ Continue Script  │
                         └──────────────────┘

No crashes, graceful degradation
```

## Performance Optimizations

1. **Selector Caching**
   ```javascript
   // Elements found once and stored
   const elements = prepareSwiperElements(component);
   // No repeated querySelector calls
   ```

2. **Early Returns**
   ```javascript
   if (alreadyInitialized) return null;
   // Skip unnecessary processing
   ```

3. **Event Delegation**
   ```javascript
   // MutationObserver on body (single listener)
   // vs. listeners on every component
   ```

4. **CSS Containment**
   ```css
   .swiper { contain: layout style paint; }
   // Limit layout calculations to component
   ```

5. **GPU Acceleration**
   ```css
   .swiper-wrapper { transform: translateZ(0); }
   // Hardware acceleration
   ```

## Memory Management

```
Component Lifecycle
├── Instance Storage
│   └── component.swiperInstance = swiper
│       • Weak reference via DOM element
│       • Garbage collected when element removed
│
├── Global Registry
│   └── window.swiperInstances = []
│       • Strong references for debugging
│       • Manually cleaned on destroy
│
└── Event Listeners
    └── MutationObserver
        • Single observer for entire page
        • Minimal memory footprint
```

## Browser Compatibility Strategy

```
ES6 Features Used:
├── Arrow Functions        → Supported: All modern browsers
├── Template Literals      → Supported: All modern browsers
├── Const/Let             → Supported: All modern browsers
├── Spread Operator       → Supported: All modern browsers
└── Object Methods        → Supported: All modern browsers

Polyfills Not Required:
└── Targets modern browsers only (see browserslist)

Graceful Degradation:
├── MutationObserver check
│   └── if (typeof MutationObserver === 'undefined') { warn() }
└── Swiper library check
    └── if (typeof Swiper === 'undefined') { error() }
```

## Security Considerations

1. **No eval() Usage**
   - All code is static
   - JSON parsed with safe methods

2. **Attribute Sanitization**
   - Data attributes only
   - Type conversion validates input

3. **CSP Compatible**
   - No inline scripts required
   - External script loading only

4. **XSS Protection**
   - No innerHTML manipulation
   - classList and setAttribute only

## Extending the System

### Adding New Features

```javascript
// 1. Add to configuration
const DEFAULT_CONFIG = {
  // ... existing
  yourNewOption: defaultValue
};

// 2. It automatically works via attributes
// data-swiper-your-new-option="value"

// 3. Swiper receives it in config
new Swiper(container, {
  yourNewOption: value // Passed through
});
```

### Custom Integrations

```javascript
// Access instance after initialization
const component = document.querySelector('[data-swiper="component"]');
const swiper = component.swiperInstance;

// Add event listeners
swiper.on('slideChange', () => {
  // Your custom code
});

// Integrate with other libraries
swiper.on('init', () => {
  // Initialize other features
});
```

## File Dependencies

```
Published Webflow Site
│
├── Requires: SwiperJS Library
│   └── CDN: swiper-bundle.min.js + swiper-bundle.min.css
│
├── Requires: Attribute System
│   ├── swiper-attribute.js
│   └── swiper-attribute.css
│
└── Optional: Custom Code
    └── User's additional scripts
```

## Loading Sequence

```
1. HTML Parse        → DOM structure created
2. CSS Load          → Swiper CSS + Attribute CSS
3. DOM Ready         → Document interactive
4. Swiper Lib Load   → SwiperJS available
5. Attribute System  → Our script runs
6. Auto-init         → Sliders initialized
7. MutationObserver  → Watching for new content
8. User Interaction  → Sliders functional
```

## Best Practices

### Do's
- ✓ Add all configuration on component element
- ✓ Use data attributes for all config
- ✓ Test on published site
- ✓ Check console for errors
- ✓ Use provided API for manual control

### Don'ts
- ✗ Don't add Swiper classes manually
- ✗ Don't modify wrapper structure
- ✗ Don't nest sliders without testing
- ✗ Don't rely on Designer preview
- ✗ Don't mix manual init with auto-init

---

**Version:** 1.0.0
**Last Updated:** 2025-01-02
**Maintainers:** Webflow Community
