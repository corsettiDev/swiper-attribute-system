# Webflow Attribute-Based Swiper System

A production-ready, attribute-driven SwiperJS implementation specifically designed for Webflow. This system eliminates the need for hardcoded Swiper class names, preventing styling conflicts and enabling complete visual control in Webflow's Designer.

## Features

- **Attribute-Based Architecture**: Uses `data-swiper` attributes instead of Swiper's class names
- **Zero Class Name Conflicts**: Style elements freely in Webflow without worrying about Swiper classes
- **Dynamic Configuration**: Configure sliders entirely through HTML attributes
- **CMS Compatible**: Works seamlessly with Webflow collection lists
- **Flexible Element Placement**: Pagination/navigation can be children of container OR siblings (crucial for CMS)
- **Auto-Initialization**: Automatically detects and initializes all sliders on page load
- **Dynamic Content Support**: MutationObserver detects and initializes sliders added after page load
- **Error Handling**: Comprehensive error messages for easy debugging
- **Public API**: Manual control methods for advanced use cases
- **Responsive**: Works across all Webflow breakpoints
- **Accessible**: Includes focus states and respects motion preferences

## Quick Start

### 1. Load Required Dependencies

Add these in your Webflow project settings (Project Settings → Custom Code → Head Code):

```html
<!-- Swiper CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

<!-- Your custom CSS -->
<link rel="stylesheet" href="/path/to/swiper-attribute.css" />
```

Then add these before `</body>` (Project Settings → Custom Code → Footer Code):

```html
<!-- Swiper JS -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<!-- Swiper Attribute System -->
<script src="/path/to/swiper-attribute.js"></script>
```

### 2. Build Your Slider in Webflow

Create this structure using Webflow's Designer:

**OPTION 1 - Traditional Structure (pagination/nav inside container):**
```
Div Block (data-swiper="component")
├── Div Block (data-swiper="container")
│   ├── Div Block (data-swiper="wrapper")
│   │   ├── Div Block (data-swiper="slide") - Slide 1
│   │   ├── Div Block (data-swiper="slide") - Slide 2
│   │   └── Div Block (data-swiper="slide") - Slide 3
│   ├── Div Block (data-swiper="pagination") [optional]
│   ├── Div Block (data-swiper="nav-prev") [optional]
│   └── Div Block (data-swiper="nav-next") [optional]
```

**OPTION 2 - CMS Compatible (pagination/nav as siblings to container):**
```
Div Block (data-swiper="component")
├── Div Block (data-swiper="container") ← Can be Collection List
│   └── Div Block (data-swiper="wrapper") ← Collection List Wrapper
│       └── Div Block (data-swiper="slide") - Collection Items (repeated)
├── Div Block (data-swiper="pagination") [optional]
├── Div Block (data-swiper="nav-prev") [optional]
└── Div Block (data-swiper="nav-next") [optional]
```

**Use Option 2 when:** Your container is a Webflow CMS Collection List, since Collection Lists cannot have static child elements added in the Designer.

### 3. Add Configuration Attributes

Select the **component** element (the outermost container) and add custom attributes for configuration:

**Basic Example:**
- `data-swiper-slides-per-view` = `3`
- `data-swiper-space-between` = `20`
- `data-swiper-loop` = `true`

**That's it!** The slider will automatically initialize when the page loads.

## HTML Structure Details

### Required Elements

| Attribute | Element Type | Required | Description |
|-----------|--------------|----------|-------------|
| `data-swiper="component"` | Container | **Yes** | Outermost wrapper, holds configuration |
| `data-swiper="container"` | Container | **Yes** | Main Swiper element |
| `data-swiper="wrapper"` | Container | **Yes** | Slides wrapper (becomes flex container) |
| `data-swiper="slide"` | Item | **Yes** | Individual slides (one per slide) |

### Optional Elements

| Attribute | Element Type | Required | Description |
|-----------|--------------|----------|-------------|
| `data-swiper="pagination"` | Container | No | Pagination dots container |
| `data-swiper="nav-prev"` | Button | No | Previous button |
| `data-swiper="nav-next"` | Button | No | Next button |

## Configuration Options

All Swiper configuration options can be set via data attributes on the **component** element. Use kebab-case attribute names that map to Swiper's camelCase options.

### Basic Options

| Attribute | Type | Default | Example | Description |
|-----------|------|---------|---------|-------------|
| `data-swiper-slides-per-view` | number/string | `1` | `3` or `"auto"` | Number of slides per view |
| `data-swiper-space-between` | number | `16` | `20` | Space between slides (px) |
| `data-swiper-loop` | boolean | `false` | `true` | Enable continuous loop |
| `data-swiper-speed` | number | `400` | `600` | Transition speed (ms) |
| `data-swiper-autoplay` | boolean/object | `false` | `true` | Enable autoplay |
| `data-swiper-direction` | string | `horizontal` | `vertical` | Slide direction |
| `data-swiper-effect` | string | `slide` | `fade` | Transition effect |
| `data-swiper-centered-slides` | boolean | `false` | `true` | Center active slide |

### Responsive Breakpoints (Webflow-Specific)

**NEW**: Use simple, separate attributes for each breakpoint instead of complex JSON!

The system supports Webflow's standard breakpoints:

| Breakpoint | Pixel Range | Suffix |
|-----------|-------------|---------|
| Mobile Portrait | 0-479px | _(base, no suffix)_ |
| Mobile Landscape | 480-767px | `-mobile-landscape` |
| Tablet | 768-991px | `-tablet` |
| Desktop | 992px+ | `-desktop` |

**Example - Responsive Slides Per View:**
```html
<!-- Mobile Portrait (0-479px) -->
data-swiper-slides-per-view="1"

<!-- Mobile Landscape (480-767px) -->
data-swiper-slides-per-view-mobile-landscape="2"

<!-- Tablet (768-991px) -->
data-swiper-slides-per-view-tablet="3"

<!-- Desktop (992px+) -->
data-swiper-slides-per-view-desktop="4"
```

**Example - Responsive Spacing:**
```html
data-swiper-space-between="10"
data-swiper-space-between-mobile-landscape="15"
data-swiper-space-between-tablet="20"
data-swiper-space-between-desktop="30"
```

**💡 Why this approach?** Webflow's attribute editor doesn't handle complex JSON well. These simple attributes are easier to use and less error-prone.

**📖 For complete breakpoint documentation**, see [WEBFLOW-BREAKPOINTS.md](WEBFLOW-BREAKPOINTS.md)

### Other Advanced Options

**Autoplay with Custom Settings** (use JSON for complex objects):
```html
data-swiper-autoplay='{"delay": 5000, "disableOnInteraction": false}'
```

**Pagination Customization**:
```html
data-swiper-pagination='{"type": "fraction", "clickable": true}'
```

**Grid Layout**:
```html
data-swiper-grid='{"rows": 2, "fill": "row"}'
```

## Complete Examples

### Example 1: Basic Image Slider

**Webflow Structure:**
```
Div Block (data-swiper="component")
  data-swiper-slides-per-view = "1"
  data-swiper-loop = "true"
  data-swiper-autoplay = "true"
  ├── Div Block (data-swiper="container")
  │   ├── Div Block (data-swiper="wrapper")
  │   │   ├── Div Block (data-swiper="slide")
  │   │   │   └── Image
  │   │   ├── Div Block (data-swiper="slide")
  │   │   │   └── Image
  │   │   └── Div Block (data-swiper="slide")
  │   │       └── Image
  │   ├── Div Block (data-swiper="pagination")
  │   ├── Div Block (data-swiper="nav-prev")
  │   └── Div Block (data-swiper="nav-next")
```

### Example 2: Multi-Column Card Slider (Responsive)

**Webflow Structure:**
```
Div Block (data-swiper="component")
  <!-- Base/Mobile Portrait -->
  data-swiper-slides-per-view = "1"
  data-swiper-space-between = "16"
  data-swiper-loop = "false"

  <!-- Mobile Landscape (480px+) -->
  data-swiper-slides-per-view-mobile-landscape = "1.5"
  data-swiper-space-between-mobile-landscape = "16"

  <!-- Tablet (768px+) -->
  data-swiper-slides-per-view-tablet = "2"
  data-swiper-space-between-tablet = "20"

  <!-- Desktop (992px+) -->
  data-swiper-slides-per-view-desktop = "3"
  data-swiper-space-between-desktop = "24"

  ├── Div Block (data-swiper="container")
  │   ├── Div Block (data-swiper="wrapper")
  │   │   ├── Div Block (data-swiper="slide")
  │   │   │   └── [Your card content]
  │   │   ├── Div Block (data-swiper="slide")
  │   │   │   └── [Your card content]
  │   │   └── Div Block (data-swiper="slide")
  │   │       └── [Your card content]
  │   └── Div Block (data-swiper="pagination")
```

### Example 3: CMS Collection Slider (Recommended Structure)

**Webflow Structure:**
```
Div Block (data-swiper="component")
  data-swiper-slides-per-view = "2"
  data-swiper-space-between = "20"
  ├── Collection List (data-swiper="container")
  │   └── Collection List Wrapper (data-swiper="wrapper")
  │       └── Collection Item (data-swiper="slide")
  │           └── [Your CMS content]
  ├── Div Block (data-swiper="pagination")
  ├── Div Block (data-swiper="nav-prev")
  └── Div Block (data-swiper="nav-next")
```

**Key Points:**
- Add `data-swiper="container"` directly to the **Collection List** element
- Add `data-swiper="wrapper"` to the **Collection List Wrapper** element
- Add `data-swiper="slide"` to the **Collection Item** element
- Place pagination and navigation **outside** the Collection List (as siblings)

### Example 4: Vertical Timeline Slider

**Webflow Structure:**
```
Div Block (data-swiper="component")
  data-swiper-direction = "vertical"
  data-swiper-slides-per-view = "3"
  data-swiper-space-between = "30"
  ├── Div Block (data-swiper="container")
  │   ├── Div Block (data-swiper="wrapper")
  │   │   ├── Div Block (data-swiper="slide")
  │   │   ├── Div Block (data-swiper="slide")
  │   │   └── Div Block (data-swiper="slide")
  │   ├── Div Block (data-swiper="nav-prev")
  │   └── Div Block (data-swiper="nav-next")
```

### Example 5: Fade Effect Slider

**Webflow Structure:**
```
Div Block (data-swiper="component")
  data-swiper-effect = "fade"
  data-swiper-slides-per-view = "1"
  data-swiper-autoplay = '{"delay": 4000}'
  data-swiper-loop = "true"
  ├── Div Block (data-swiper="container")
  │   ├── Div Block (data-swiper="wrapper")
  │   │   ├── Div Block (data-swiper="slide")
  │   │   ├── Div Block (data-swiper="slide")
  │   │   └── Div Block (data-swiper="slide")
  │   └── Div Block (data-swiper="pagination")
```

## Styling in Webflow

### Design Freedom

All elements can be styled freely in Webflow's Designer:
- Add padding, margins, backgrounds to slides
- Style pagination bullets and buttons
- Apply hover states
- Use Webflow's responsive breakpoints
- Add custom animations

The system adds Swiper classes programmatically **after** your custom classes, so your styles take precedence.

### Recommended Approach

1. **Container**: Set width and height constraints
2. **Wrapper**: Generally no styling needed (system handles layout)
3. **Slides**: Style freely - backgrounds, padding, borders, etc.
4. **Pagination**: Position and style dots to match your design
5. **Navigation**: Style buttons or replace with custom icons

### Custom Navigation Icons

To use custom icons/images instead of default buttons:

1. Add your icon/image inside the `nav-prev` and `nav-next` elements
2. The default arrow icons are hidden via CSS
3. Style the container as needed

## Advanced Usage

### Manual Initialization

If you need to initialize sliders manually (e.g., after AJAX load):

```javascript
// Initialize all sliders
WebflowSwiper.init();

// Initialize specific slider
WebflowSwiper.initComponent('#my-slider');

// Reinitialize after content change
WebflowSwiper.reinitComponent('#my-slider');
```

### Accessing Swiper Instances

```javascript
// Get all instances
const instances = WebflowSwiper.getInstances();

// Get specific instance
const mySlider = WebflowSwiper.getInstance('#my-slider');

// Use Swiper API methods
mySlider.slideNext();
mySlider.slidePrev();
mySlider.slideTo(3);
```

### Destroying Sliders

```javascript
// Destroy specific slider
WebflowSwiper.destroyComponent('#my-slider');
```

### Custom Events

Listen to Swiper events:

```javascript
const component = document.querySelector('[data-swiper="component"]');
const swiper = component.swiperInstance;

swiper.on('slideChange', function () {
  console.log('Slide changed to:', swiper.activeIndex);
});

swiper.on('reachEnd', function () {
  console.log('Reached the end of slider');
});
```

## Quick Reference

### Required HTML Structure

```html
<div data-swiper="component" [CONFIG ATTRIBUTES HERE]>
  <div data-swiper="container">
    <div data-swiper="wrapper">
      <div data-swiper="slide"><!-- Content --></div>
      <div data-swiper="slide"><!-- Content --></div>
      <div data-swiper="slide"><!-- Content --></div>
    </div>
    <div data-swiper="pagination"></div>
    <div data-swiper="nav-prev"></div>
    <div data-swiper="nav-next"></div>
  </div>
</div>
```

### Common Configuration Patterns

**Basic Auto-Play Slider:**
```html
data-swiper-loop="true"
data-swiper-autoplay="true"
```

**Multi-Column Slider:**
```html
data-swiper-slides-per-view="3"
data-swiper-space-between="20"
```

**Responsive Slider (New Attribute Method):**
```html
data-swiper-slides-per-view="1"
data-swiper-slides-per-view-mobile-landscape="2"
data-swiper-slides-per-view-tablet="3"
data-swiper-slides-per-view-desktop="4"
```

**Centered Slides:**
```html
data-swiper-centered-slides="true"
data-swiper-slides-per-view="1.5"
```

**Fade Effect:**
```html
data-swiper-effect="fade"
data-swiper-speed="800"
```

**Vertical Slider:**
```html
data-swiper-direction="vertical"
```

### JavaScript API Quick Reference

```javascript
// Initialize all sliders
WebflowSwiper.init();

// Initialize specific slider
WebflowSwiper.initComponent('#my-slider');

// Destroy slider
WebflowSwiper.destroyComponent('#my-slider');

// Reinitialize slider
WebflowSwiper.reinitComponent('#my-slider');

// Get all instances
const instances = WebflowSwiper.getInstances();

// Get specific instance
const swiper = WebflowSwiper.getInstance('#my-slider');

// Use Swiper API methods
swiper.slideNext();
swiper.slidePrev();
swiper.slideTo(3);
```

### Common Slider Patterns

**Product Showcase:**
```html
data-swiper-slides-per-view="1"
data-swiper-space-between="16"
data-swiper-slides-per-view-tablet="2"
data-swiper-slides-per-view-desktop="4"
data-swiper-space-between-desktop="24"
```

**Testimonial Slider:**
```html
data-swiper-slides-per-view="1"
data-swiper-autoplay='{"delay":5000}'
data-swiper-loop="true"
data-swiper-effect="fade"
```

**Image Gallery:**
```html
data-swiper-slides-per-view="1"
data-swiper-space-between="0"
data-swiper-loop="true"
data-swiper-keyboard="true"
```

**Logo Carousel:**
```html
data-swiper-slides-per-view="2"
data-swiper-space-between="40"
data-swiper-loop="true"
data-swiper-autoplay='{"delay":2000}'
data-swiper-slides-per-view-tablet="3"
data-swiper-slides-per-view-desktop="5"
```

### Troubleshooting Checklist

- [ ] SwiperJS library loaded before attribute system?
- [ ] All required attributes present (component, container, wrapper, slide)?
- [ ] Testing on published site (not Designer preview)?
- [ ] Check browser console for error messages?
- [ ] Container has width/height set?
- [ ] For CMS: pagination/nav are siblings to Collection List?

## Troubleshooting

### Slider Not Initializing

**Check Console**: Look for error messages with `[Swiper Attribute]` prefix.

**Common Issues:**
1. SwiperJS library not loaded before the attribute script
2. Missing required elements (container, wrapper, or slides)
3. Incorrect attribute values (e.g., invalid JSON in breakpoints)

### Slides Not Visible

1. Ensure container has width and height
2. Check if slides have content
3. Verify wrapper has `display: flex` (should be automatic)

### Navigation Not Working

1. Verify both `nav-prev` and `nav-next` elements exist
2. Check if they're inside the `component` element (can be children of component OR children of container)
3. Ensure they're not hidden by CSS

### Pagination Not Appearing

1. Verify `pagination` element exists inside `component` (can be child of component OR child of container)
2. Check if it's positioned correctly (default: absolute bottom)
3. Ensure z-index is high enough to appear above slides

### CMS Collection Slides Not Working

1. Add `data-swiper="container"` to the **Collection List** element itself
2. Add `data-swiper="wrapper"` to the **Collection List Wrapper**
3. Add `data-swiper="slide"` to the **Collection Item**
4. Place pagination/navigation as **siblings** to the Collection List (not inside it)
5. Check console for initialization messages

**Correct CMS Structure:**
```
[data-swiper="component"] (Div Block wrapper)
├── [data-swiper="container"] (Collection List)
│   └── [data-swiper="wrapper"] (Collection List Wrapper)
│       └── [data-swiper="slide"] (Collection Item - repeated)
├── [data-swiper="pagination"] (Div Block - sibling to Collection List)
└── [data-swiper="nav-prev/next"] (Div Blocks - siblings to Collection List)
```

### Breakpoints Not Working

1. **Use the new attribute-based breakpoints** instead of JSON:
   - ✅ `data-swiper-slides-per-view-tablet="2"`
   - ❌ `data-swiper-breakpoints='{"768":{"slidesPerView":2}}'` (old way)
2. Check attribute spelling - must match exactly:
   - `-mobile-portrait` (or no suffix for base)
   - `-mobile-landscape`
   - `-tablet`
   - `-desktop`
3. Test on published site, not in Webflow Designer preview
4. Check console for error messages

**See [WEBFLOW-BREAKPOINTS.md](WEBFLOW-BREAKPOINTS.md) for complete guide**

## Performance Optimization

### Best Practices

1. **Lazy Loading**: For image-heavy sliders, use Swiper's lazy loading:
   ```html
   data-swiper-lazy='{"loadPrevNext": true}'
   ```

2. **Disable Loop for Large Sliders**: Loop mode duplicates slides, increasing DOM size:
   ```html
   data-swiper-loop="false"
   ```

3. **Virtual Slides**: For hundreds of slides, use virtual slides:
   ```html
   data-swiper-virtual="true"
   ```

4. **Limit Autoplay**: If using autoplay, add reasonable delays:
   ```html
   data-swiper-autoplay='{"delay": 5000}'
   ```

## Production Deployment

### Pre-Launch Checklist

Before deploying to production, verify:

- [ ] SwiperJS library CDN included in `<head>`
- [ ] swiper-attribute.css included in `<head>`
- [ ] SwiperJS bundle.js included before `</body>`
- [ ] swiper-attribute.js included before `</body>`
- [ ] All sliders have required attributes (component, container, wrapper, slide)
- [ ] Tested on published site (not just Designer preview)
- [ ] Tested across all Webflow breakpoints (mobile, tablet, desktop)
- [ ] Browser console checked for errors
- [ ] CMS content tested if applicable
- [ ] Accessibility features verified (keyboard navigation, focus states)
- [ ] Performance tested with realistic content volume

### File Sizes

- **swiper-attribute.js**: ~18KB (uncompressed), ~6KB (minified + gzip)
- **swiper-attribute.css**: ~10KB (uncompressed), ~3KB (minified + gzip)
- **Total footprint**: ~28KB uncompressed, ~9KB minified + gzip

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: Latest 2 versions
- Android Chrome: Latest 2 versions

## Dependencies

- **SwiperJS**: v11.x (recommended) or v8.x+
- **Webflow**: All plans

## File Structure

```
swiper-attribute-system/
├── swiper-attribute.js    # Core logic (18KB minified)
├── swiper-attribute.css   # Helper styles (8KB)
└── README.md              # This file
```

## Migration from Standard Swiper

If you have existing Swiper implementations:

1. Keep your current HTML structure
2. Replace Swiper class names with data attributes:
   - `.swiper` → `data-swiper="container"`
   - `.swiper-wrapper` → `data-swiper="wrapper"`
   - `.swiper-slide` → `data-swiper="slide"`
3. Wrap everything in a div with `data-swiper="component"`
4. Move configuration from JS to data attributes
5. Remove custom initialization code

## License

This system is provided as-is for use in Webflow projects. SwiperJS itself is licensed under MIT.

## Support

For issues specific to this attribute system:
1. Check console for error messages
2. Review troubleshooting section above
3. Verify HTML structure matches examples

For SwiperJS functionality questions:
- Visit: https://swiperjs.com/
- Documentation: https://swiperjs.com/swiper-api

## Version History

- **1.1.0** (2025-01-02): Flexible element placement
  - Added support for pagination/navigation as siblings to container (critical for CMS)
  - Updated element detection to search within component scope
  - Enhanced CMS Collection List compatibility
  - Updated documentation with both structure options

- **1.0.0** (2025-01-02): Initial release
  - Attribute-based architecture
  - Auto-initialization
  - MutationObserver support
  - Public API
  - Comprehensive error handling
  - Webflow-specific breakpoint system

---

Built with ❤️ for the Webflow community
