# Webflow Quick Start Guide

This guide walks you through implementing the Swiper Attribute System in your Webflow project step-by-step.

## Step 1: Add Required Scripts & Styles

### In Webflow Designer

1. Go to **Project Settings** (gear icon in top left)
2. Navigate to **Custom Code** tab
3. Scroll to **Head Code** section
4. Paste this code:

```html
<!-- Swiper CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css" />

<!-- Swiper Attribute System CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/corsettiDev/swiper-attribute-system@latest/swiper-attribute.css" />
```

5. Scroll to **Footer Code** section
6. Paste this code:

```html
<!-- Swiper JS Library -->
<script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>

<!-- Swiper Attribute System -->
<script src="https://cdn.jsdelivr.net/gh/corsettiDev/swiper-attribute-system@latest/swiper-attribute.js"></script>
```

### Alternative: Paste Directly (If CDN Blocked)

If you can't use CDN links (e.g., due to corporate firewall):

**Option A: Paste CSS and JS Inline**
1. Copy the content of `swiper-attribute.css` from GitHub
2. In Head Code, wrap it in `<style>` tags and paste
3. Copy the content of `swiper-attribute.js` from GitHub
4. In Footer Code, wrap it in `<script>` tags and paste

**Option B: Host on Webflow**
1. Download `swiper-attribute.css` and `swiper-attribute.js` from GitHub
2. Upload to Webflow's hosting (if supported by your plan)
3. Reference them with the URLs Webflow provides

## Step 2: Build Your First Slider

### Basic Image Slider

1. **Add a Div Block** to your page
   - Select it and add custom attribute:
   - Name: `data-swiper`
   - Value: `component`

2. **Inside it, add another Div Block**
   - Add custom attribute:
   - Name: `data-swiper`
   - Value: `container`

3. **Inside the container, add a Div Block**
   - Add custom attribute:
   - Name: `data-swiper`
   - Value: `wrapper`

4. **Inside the wrapper, add 3+ Div Blocks** (your slides)
   - For each one, add custom attribute:
   - Name: `data-swiper`
   - Value: `slide`
   - Add your content (images, text, etc.) inside each slide

5. **Back in the container, add two more Div Blocks** (siblings to wrapper)
   - First one:
     - Name: `data-swiper`
     - Value: `pagination`
   - Second one:
     - Name: `data-swiper`
     - Value: `nav-prev`
   - Third one:
     - Name: `data-swiper`
     - Value: `nav-next`

### Your Structure Should Look Like:

```
Div Block [data-swiper="component"]
├── Div Block [data-swiper="container"]
    ├── Div Block [data-swiper="wrapper"]
    │   ├── Div Block [data-swiper="slide"] ← Your first slide
    │   ├── Div Block [data-swiper="slide"] ← Your second slide
    │   └── Div Block [data-swiper="slide"] ← Your third slide
    ├── Div Block [data-swiper="pagination"]
    ├── Div Block [data-swiper="nav-prev"]
    └── Div Block [data-swiper="nav-next"]
```

## Step 3: Add Configuration

Select the **component** element (the outermost div) and add these custom attributes:

### For a Basic Auto-Playing Slider:
- Name: `data-swiper-loop` | Value: `true`
- Name: `data-swiper-autoplay` | Value: `true`

### For a Multi-Column Slider:
- Name: `data-swiper-slides-per-view` | Value: `3`
- Name: `data-swiper-space-between` | Value: `20`

### For Responsive Behavior (New Attribute Method):
- Name: `data-swiper-slides-per-view` | Value: `1`
- Name: `data-swiper-slides-per-view-mobile-landscape` | Value: `2`
- Name: `data-swiper-slides-per-view-tablet` | Value: `3`
- Name: `data-swiper-slides-per-view-desktop` | Value: `4`

**Note:** See the "Responsive Breakpoints" section below for complete details on Webflow's breakpoint system.

## Step 4: Style Your Slider

### Container Styling (data-swiper="container")
- Set **Width**: 100% or your desired width
- Set **Height**: Auto or specific height (e.g., 400px for fixed height)
- Add **padding** if needed

### Slide Styling (data-swiper="slide")
- Add **backgrounds**, **padding**, **borders**
- Style text, images, or any content inside
- These styles won't conflict with Swiper functionality

### Pagination Styling (data-swiper="pagination")
- Default position: bottom center
- To move it, use Webflow's position tools
- To style bullets, you can add custom CSS targeting `.swiper-pagination-bullet`

### Navigation Buttons (data-swiper="nav-prev" & "nav-next")
- Add images or icons inside these divs
- Style the container divs as needed
- Default arrows are hidden automatically

## Step 5: Publish and Test

1. **Save** your changes
2. **Publish** your site
3. **Open** the published page in a browser
4. **Check the console** (F12) - you should see initialization messages

## Common Webflow Scenarios

### Scenario 1: CMS Collection Slider

This is the most important use case for Webflow users. The following guide shows you exactly how to implement a slider using Webflow CMS Collection Lists.

#### Why This Structure Matters

**The Challenge:** Webflow's Collection Lists are dynamic elements that cannot have static children added in the Designer. You can't add a pagination div inside a Collection List.

**The Solution:** Place pagination and navigation as **siblings** to the Collection List (but still children of the component wrapper). This gives you:
- Full use of the Collection List as the slider container
- Complete control over static UI elements
- Webflow's CMS dynamic content functionality
- Full compatibility with the Swiper library

#### The Correct Structure

```
Div Block [data-swiper="component"]
├── Collection List [data-swiper="container"]
│   └── Collection List Wrapper [data-swiper="wrapper"]
│       └── Collection Item [data-swiper="slide"]
│           └── Your CMS content (images, text, etc.)
├── Div Block [data-swiper="pagination"]
├── Div Block [data-swiper="nav-prev"]
└── Div Block [data-swiper="nav-next"]
```

**Key Point:** Pagination and navigation are **siblings** to the Collection List, not children of it.

#### Step-by-Step in Webflow Designer

**Step 1: Create Component Wrapper**
1. Add a **Div Block** to your page
2. Select it and open Settings Panel
3. Add custom attribute:
   - Name: `data-swiper`
   - Value: `component`
4. Optionally add configuration attributes (see Step 6)

**Step 2: Add Collection List**
1. Inside the component wrapper, add a **Collection List**
2. Connect it to your CMS collection as usual
3. Select the **Collection List** element (the outermost purple element)
4. Add custom attribute:
   - Name: `data-swiper`
   - Value: `container`

**Step 3: Configure Collection List Wrapper**
1. Select the **Collection List Wrapper** (the middle purple element)
2. Add custom attribute:
   - Name: `data-swiper`
   - Value: `wrapper`

**Step 4: Configure Collection Item**
1. Select the **Collection Item** (the innermost purple element)
2. Add custom attribute:
   - Name: `data-swiper`
   - Value: `slide`
3. Design your CMS content inside the Collection Item as usual
4. Add CMS fields (images, text, etc.)

**Step 5: Add Pagination and Navigation**
1. Go back to the **component wrapper** (the outermost Div Block from Step 1)
2. Add a **Div Block** as a sibling to the Collection List
3. Add attribute:
   - Name: `data-swiper`
   - Value: `pagination`
4. Add another **Div Block** as a sibling
5. Add attribute:
   - Name: `data-swiper`
   - Value: `nav-prev`
6. Add another **Div Block** as a sibling
7. Add attribute:
   - Name: `data-swiper`
   - Value: `nav-next`

**Step 6: Configure Slider Behavior**
1. Select the **component wrapper** (outermost Div Block)
2. Add configuration attributes:
   - `data-swiper-slides-per-view` = `1`
   - `data-swiper-space-between` = `24`
   - `data-swiper-loop` = `false`
   - For responsive behavior, add breakpoint attributes:
     - `data-swiper-slides-per-view-tablet` = `2`
     - `data-swiper-slides-per-view-desktop` = `3`

#### Common CMS Use Cases

**Product Slider:**
```html
Component attributes:
  data-swiper-slides-per-view="1"
  data-swiper-space-between="20"
  data-swiper-slides-per-view-tablet="2"
  data-swiper-slides-per-view-desktop="4"
  data-swiper-space-between-desktop="24"
```

**Blog Post Carousel:**
```html
Component attributes:
  data-swiper-slides-per-view="1"
  data-swiper-space-between="30"
  data-swiper-slides-per-view-tablet="2"
  data-swiper-slides-per-view-desktop="3"
```

**Team Member Slider:**
```html
Component attributes:
  data-swiper-slides-per-view="1"
  data-swiper-space-between="24"
  data-swiper-loop="false"
  data-swiper-slides-per-view-mobile-landscape="2"
  data-swiper-slides-per-view-tablet="3"
  data-swiper-slides-per-view-desktop="4"
```

**Testimonial Slider:**
```html
Component attributes:
  data-swiper-slides-per-view="1"
  data-swiper-effect="fade"
  data-swiper-autoplay='{"delay": 5000}'
  data-swiper-loop="true"
```

**Portfolio Slider:**
```html
Component attributes:
  data-swiper-slides-per-view="1"
  data-swiper-space-between="40"
  data-swiper-centered-slides="true"
  data-swiper-loop="true"
  data-swiper-slides-per-view-tablet="2"
```

#### Styling Tips for CMS Sliders

**Container Sizing:**
Set width and height on the Collection List element:
- Width: 100% (or your desired width)
- Height: Auto (for dynamic height) or specific height (400px, 500px, etc.)

**Slide Content:**
Style the Collection Item as you normally would:
- Add padding, margins, backgrounds
- Position CMS fields (images, text)
- Add hover effects
- Use Webflow's responsive breakpoints

**Pagination Positioning:**
The pagination div can be positioned anywhere:
- Absolute positioning to overlay the slider
- Static positioning below the slider
- Style the bullets with custom CSS if needed

**Navigation Buttons:**
Style the nav-prev and nav-next divs:
- Position them on the sides of the slider
- Add background, padding, borders
- Insert icons or images inside them
- The default Swiper arrows are hidden by default

#### CMS Troubleshooting

**Slides Don't Appear:**
1. Check that all attributes are spelled correctly
2. Verify the Collection List has items to display
3. Ensure scripts are loaded (check console for errors)
4. Publish the site and test (Designer preview may not show sliders)

**Pagination/Nav Not Working:**
1. Verify pagination and nav are **siblings** to Collection List, not inside it
2. Check that they're inside the component wrapper
3. Ensure they have the correct data attributes
4. Check console for JavaScript errors

**CMS Content Not Updating:**
1. Make sure you've published the site after making CMS changes
2. Clear browser cache
3. Check that Collection List is properly connected to CMS

### Scenario 2: Multiple Sliders on One Page

You can have multiple sliders! Just repeat the structure for each one. They'll all initialize automatically.

Give each component a unique ID or class name for targeting if you need to control them individually via JavaScript.

### Scenario 3: Slider Inside a Tab or Dropdown

If your slider is hidden initially (in a tab, accordion, etc.):

1. The slider will initialize but might have layout issues
2. After the tab/accordion opens, reinitialize the slider:

```html
<script>
// Find your slider component
const sliderComponent = document.querySelector('#your-slider-id');

// Reinitialize it
WebflowSwiper.reinitComponent(sliderComponent);
</script>
```

### Scenario 4: Card Grid Slider

Perfect for product showcases:

1. Set `data-swiper-slides-per-view="3"`
2. Set `data-swiper-space-between="24"`
3. Add responsive breakpoints:
   ```
   {"320":{"slidesPerView":1,"spaceBetween":16},"768":{"slidesPerView":2,"spaceBetween":20},"1024":{"slidesPerView":3,"spaceBetween":24}}
   ```

## Responsive Breakpoints

The Swiper Attribute System uses **Webflow-specific breakpoint attributes** that match Webflow Designer's responsive breakpoints. This approach is much simpler than using JSON and works perfectly with Webflow's attribute editor.

### Webflow's Standard Breakpoints

The system uses these breakpoint values (matching Webflow Designer):

| Breakpoint Name | Pixel Range | Attribute Suffix |
|----------------|-------------|------------------|
| **Mobile Portrait** | 0px - 479px | _(base, no suffix)_ |
| **Mobile Landscape** | 480px - 767px | `-mobile-landscape` |
| **Tablet** | 768px - 991px | `-tablet` |
| **Desktop** | 992px+ | `-desktop` |

### How It Works

Instead of using complex JSON like this:
```html
<!-- ❌ OLD WAY (harder to maintain) -->
data-swiper-breakpoints='{"480":{"slidesPerView":2},"768":{"slidesPerView":3}}'
```

You now use simple, separate attributes like this:
```html
<!-- ✅ NEW WAY (Webflow-friendly) -->
data-swiper-slides-per-view-mobile-landscape="2"
data-swiper-slides-per-view-tablet="3"
data-swiper-slides-per-view-desktop="4"
```

### Attribute Syntax

Any Swiper configuration option can have breakpoint-specific variants:

**Pattern:** `data-swiper-[option-name]-[breakpoint]="value"`

#### Examples

**Slides Per View:**
```html
<!-- Base (mobile portrait: 0-479px) -->
data-swiper-slides-per-view="1"

<!-- Mobile Landscape (480-767px) -->
data-swiper-slides-per-view-mobile-landscape="2"

<!-- Tablet (768-991px) -->
data-swiper-slides-per-view-tablet="3"

<!-- Desktop (992px+) -->
data-swiper-slides-per-view-desktop="4"
```

**Space Between:**
```html
<!-- Base -->
data-swiper-space-between="10"

<!-- Responsive variants -->
data-swiper-space-between-mobile-landscape="15"
data-swiper-space-between-tablet="20"
data-swiper-space-between-desktop="30"
```

**Speed:**
```html
<!-- Base -->
data-swiper-speed="400"

<!-- Responsive variants -->
data-swiper-speed-tablet="600"
data-swiper-speed-desktop="800"
```

### Complete Responsive Example

Here's a full responsive slider configuration:

```html
<div
  data-swiper="component"

  <!-- Base config (Mobile Portrait: 0-479px) -->
  data-swiper-slides-per-view="1"
  data-swiper-space-between="10"
  data-swiper-loop="true"

  <!-- Mobile Landscape: 480-767px -->
  data-swiper-slides-per-view-mobile-landscape="2"
  data-swiper-space-between-mobile-landscape="15"

  <!-- Tablet: 768-991px -->
  data-swiper-slides-per-view-tablet="3"
  data-swiper-space-between-tablet="20"

  <!-- Desktop: 992px+ -->
  data-swiper-slides-per-view-desktop="4"
  data-swiper-space-between-desktop="30"
>
  <!-- Slider content here -->
</div>
```

### How to Add in Webflow Designer

1. **Select the component element** (the one with `data-swiper="component"`)

2. **In the Settings panel**, click the "Custom Attributes" section

3. **Add your base attributes** (for mobile portrait):
   - Name: `data-swiper-slides-per-view`
   - Value: `1`

4. **Add breakpoint-specific attributes**:
   - Click "+ Add Custom Attribute"
   - Name: `data-swiper-slides-per-view-tablet`
   - Value: `2`

5. **Repeat** for each breakpoint you need

**No Quotes Needed!** In Webflow's attribute editor, just type the value directly:
- ✅ Type: `2`
- ❌ Don't type: `"2"`

Webflow handles the quoting automatically.

### Cascading Behavior

The system uses a **mobile-first** approach with cascading defaults:

1. **Mobile Portrait** (0-479px) uses the base attribute value
2. **Mobile Landscape** (480-767px) uses its specific value, or falls back to Mobile Portrait
3. **Tablet** (768-991px) uses its specific value, or falls back to Mobile Landscape
4. **Desktop** (992px+) uses its specific value, or falls back to Tablet

**Example:**
```html
<div
  data-swiper="component"
  data-swiper-slides-per-view="1"
  data-swiper-slides-per-view-tablet="2"
  data-swiper-slides-per-view-desktop="4"
>
```

**Result:**
- Mobile Portrait (0-479px): `1` (from base)
- Mobile Landscape (480-767px): `1` (inherits from base)
- Tablet (768-991px): `2` (from tablet attribute)
- Desktop (992px+): `4` (from desktop attribute)

### Common Responsive Patterns

**Pattern 1: Simple Mobile-to-Desktop Scale**
Show more slides as screen gets larger:

```html
data-swiper-slides-per-view="1"
data-swiper-slides-per-view-mobile-landscape="1.5"
data-swiper-slides-per-view-tablet="2.5"
data-swiper-slides-per-view-desktop="3.5"
```

**Pattern 2: Optimize Spacing**
Adjust spacing for better fit:

```html
data-swiper-space-between="8"
data-swiper-space-between-tablet="16"
data-swiper-space-between-desktop="24"
```

**Pattern 3: Disable Loop on Mobile**
```html
data-swiper-loop="false"
data-swiper-loop-desktop="true"
```

**Pattern 4: Product Grid**
```html
<!-- Mobile: 1 product -->
data-swiper-slides-per-view="1"
data-swiper-space-between="16"

<!-- Mobile Landscape: 2 products -->
data-swiper-slides-per-view-mobile-landscape="2"

<!-- Tablet: 3 products -->
data-swiper-slides-per-view-tablet="3"
data-swiper-space-between-tablet="20"

<!-- Desktop: 4 products -->
data-swiper-slides-per-view-desktop="4"
data-swiper-space-between-desktop="24"
```

**Pattern 5: Testimonial Slider**
```html
<!-- All screens: 1 testimonial at a time -->
data-swiper-slides-per-view="1"
data-swiper-space-between="20"
data-swiper-centered-slides="true"

<!-- Desktop: show partial next/prev slides -->
data-swiper-slides-per-view-desktop="1.2"
data-swiper-space-between-desktop="30"
```

### Supported Options

You can add breakpoint suffixes to any Swiper configuration option:

**Most Common:**
- `slides-per-view`
- `space-between`
- `slides-per-group`
- `centered-slides`
- `loop`
- `speed`

**Advanced:**
- `slides-offset-before`
- `slides-offset-after`
- `grab-cursor`
- `free-mode`
- `direction`

### Breakpoint Troubleshooting

**Breakpoints Not Working:**

1. Check the console for error messages
2. Common issues:
   - Typo in attribute name (check spelling of breakpoint suffix)
   - Wrong value type (e.g., using text for a number)
   - Not testing on published site (test in browser, not Webflow Designer preview)

**Different Behavior Than Expected:**

Remember: Swiper uses mobile-first breakpoints. A setting applies at its breakpoint **and above** until overridden.

**Example:**
```html
data-swiper-slides-per-view="1"
data-swiper-slides-per-view-tablet="3"
```
Result: Mobile Portrait AND Mobile Landscape both show 1 slide (not just Mobile Portrait).

**Viewing in Webflow Designer:**

The breakpoints may not work correctly in the Webflow Designer preview. Always test on the **published site** or use **Preview mode** for accurate results.

## Configuration Cheat Sheet

Add these as custom attributes on the **component** element:

| What You Want | Attribute Name | Example Value |
|---------------|----------------|---------------|
| Auto-play slides | `data-swiper-autoplay` | `true` or `{"delay": 5000}` |
| Loop continuously | `data-swiper-loop` | `true` |
| Show multiple slides | `data-swiper-slides-per-view` | `3` |
| Space between slides | `data-swiper-space-between` | `20` |
| Slide speed | `data-swiper-speed` | `600` |
| Fade effect | `data-swiper-effect` | `fade` |
| Vertical slider | `data-swiper-direction` | `vertical` |
| Center active slide | `data-swiper-centered-slides` | `true` |
| Responsive settings | `data-swiper-breakpoints` | See examples above |

## Webflow Interactions Compatibility

### Can I Use Webflow Interactions Too?

**Yes!** The Swiper system won't conflict with Webflow's interactions. However:

- **Avoid** adding Webflow interactions that move/transform the wrapper or slides
- **Safe to use**: Hover effects, clicks on buttons/links inside slides, fade effects on content
- **Not recommended**: Slide animations, transforms on wrapper element

### Combining Swiper with Webflow Interactions

Example: Fade in slide content on slide change

1. Build your slider as normal
2. Add Webflow interactions to elements **inside** each slide
3. Trigger them with custom code:

```html
<script>
const component = document.querySelector('[data-swiper="component"]');
const swiper = component.swiperInstance;

swiper.on('slideChange', function() {
  // Trigger your Webflow interaction here
  console.log('Slide changed!');
});
</script>
```

## Troubleshooting in Webflow

### My slider doesn't appear

1. **Check structure**: Make sure all required attributes are present
2. **Check console**: Open browser console (F12) and look for error messages
3. **Check scripts**: Ensure Swiper library loads before the attribute system
4. **Test published site**: Sliders might not work in Webflow Designer preview

### Slides are stacked vertically

1. **Check wrapper**: The `data-swiper="wrapper"` must be present
2. **Check scripts**: JS might not be loading - check console for errors
3. **Publish first**: Sometimes issues only resolve on the published site

### Pagination/Navigation not showing

1. **Check elements exist**: Pagination and nav elements must be inside the component (can be siblings to container OR children of container)
2. **For CMS sliders**: Ensure pagination/nav are siblings to the Collection List, not inside it
3. **Check z-index**: Pagination might be behind slides
4. **Check colors**: Default bullets are semi-transparent - they might blend in
5. **Add custom styling**: Use Webflow's Designer to style them visibly

### Responsive breakpoints not working

1. **Check JSON syntax**: Must use double quotes inside, single quotes outside
2. **Example**: `data-swiper-breakpoints='{"768":{"slidesPerView":2}}'`
3. **Test on published site**: Webflow Designer preview may not reflect breakpoints accurately

### CMS Collection slides not working

1. **Check attribute placement**:
   - `data-swiper="container"` goes on the **Collection List** element
   - `data-swiper="wrapper"` goes on the **Collection List Wrapper**
   - `data-swiper="slide"` goes on the **Collection Item**
2. **Check pagination/nav placement**: Must be siblings to Collection List (outside it), not inside
3. **Verify structure**: Collection List should be directly inside the component wrapper
4. **Publish first**: CMS elements need to be on published site to test properly

**Correct structure reminder:**
```
[data-swiper="component"] (Div Block)
├── [data-swiper="container"] (Collection List)
│   └── [data-swiper="wrapper"] (Collection List Wrapper)
│       └── [data-swiper="slide"] (Collection Item)
├── [data-swiper="pagination"] (Div Block)
└── [data-swiper="nav-prev/next"] (Div Blocks)
```

## Getting Help

1. **Check browser console** - Error messages will guide you
2. **Review README.md** - Comprehensive documentation
3. **Open demo.html** - Working examples of every feature
4. **Check HTML structure** - Compare yours to the examples

## Pro Tips for Webflow

1. **Name your elements**: Give each div a class name (even if unstyled) for easy identification
2. **Use Webflow's built-in breakpoints**: Match Swiper breakpoints to Webflow's (479px, 767px, 991px)
3. **Test on published site**: Many issues only appear/resolve on the live site
4. **Use Combo Classes**: Style different slider variations with Webflow combo classes
5. **Backup your work**: Before major changes, duplicate your slider structure
6. **Start simple**: Get a basic slider working first, then add complexity
7. **Console is your friend**: Keep it open (F12) to see initialization messages

## Next Steps

Once you have a basic slider working:

1. Experiment with different effects (fade, cube, flip)
2. Add custom styling to match your brand
3. Try responsive breakpoints
4. Explore the API for custom controls
5. Build specialized sliders (testimonials, galleries, etc.)

Happy sliding! 🎢
