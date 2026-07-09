---
name: Mingle
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5a4044'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#8e6f74'
  outline-variant: '#e3bdc3'
  surface-tint: '#bc004f'
  primary: '#b0004a'
  on-primary: '#ffffff'
  primary-container: '#d81b60'
  on-primary-container: '#fff2f3'
  inverse-primary: '#ffb2bf'
  secondary: '#705d00'
  on-secondary: '#ffffff'
  secondary-container: '#fcd400'
  on-secondary-container: '#6e5c00'
  tertiary: '#8d22a9'
  on-tertiary: '#ffffff'
  tertiary-container: '#a941c4'
  on-tertiary-container: '#fff1fc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9de'
  primary-fixed-dim: '#ffb2bf'
  on-primary-fixed: '#3f0016'
  on-primary-fixed-variant: '#90003b'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#fdd6ff'
  tertiary-fixed-dim: '#f3aeff'
  on-tertiary-fixed: '#340042'
  on-tertiary-fixed-variant: '#790096'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 20px
---

## Brand & Style
The design system is built for a high-end matchmaking and social ecosystem that balances emotional connection with tangible rewards. The brand personality is vibrant, optimistic, and premium, aiming to evoke a sense of exclusivity and excitement.

The visual style is **Modern Minimalist with a Tactile twist**. It utilizes high-quality photography, expansive whitespace, and soft, sophisticated depth to create an environment that feels both professional and intimately social. The interface remains unobtrusive to allow user-generated content to lead, while using vibrant accent colors to guide the user toward high-value "rewarding" interactions.

## Colors
The palette is centered on a high-energy **Electric Violet** primary color, used for core actions and brand moments. **Gold** is reserved strictly for the "earning" and "matchmaking" premium features, creating a clear visual distinction between social browsing and value-added tasks.

- **Primary (#D81B60):** Used for main CTAs, active states, and brand iconography.
- **Secondary (#FFD700):** Applied to reward indicators, badges, and "gold-tier" profiles.
- **Surface:** Pure white (#FFFFFF) for cards and modals to ensure a crisp, premium feel.
- **Background:** Very light grey (#F5F5F5) to provide a soft contrast against the white surface elements.
- **Text:** Deep charcoal for legibility, with medium grey for secondary metadata.

## Typography
The typography strategy pairings high-character headings with functional body text. **Montserrat** provides a bold, geometric confidence for headlines, enhanced by generous letter spacing to evoke a premium editorial feel. 

**Inter** is utilized for all functional and body text to ensure maximum readability and a systematic, modern aesthetic. Labels use a slightly increased letter spacing and semi-bold weight to maintain hierarchy in data-rich reward screens. Use the mobile-specific headline tokens to prevent text wrap issues on smaller viewports.

## Layout & Spacing
The layout follows a **Fluid Grid** system designed for high-density content on mobile and expansive layouts on desktop. 

- **Mobile:** Uses a 4-column grid with 20px side margins and 16px gutters. Profiles occupy a single full-width card or two-column mini-cards.
- **Desktop:** Transitions to a 12-column grid. Sidebars are used for navigation and filters, while the main feed remains centered with a max-width of 800px to maintain focus.
- **Spacing Rhythm:** Based on an 8px scale. Use `md (24px)` for standard padding within cards and `lg (40px)` for vertical section breathing room.

## Elevation & Depth
This design system utilizes **Tonal Layering** and **Ambient Shadows** to create a sophisticated sense of hierarchy. 

Depth is communicated through three primary tiers:
1.  **Level 0 (Base):** Light grey background (#F5F5F5) which acts as the floor.
2.  **Level 1 (Cards):** Pure white surfaces with a soft, diffused shadow (0px 4px 20px rgba(0,0,0,0.05)). This is where 90% of content lives.
3.  **Level 2 (Modals/CTAs):** Floating elements and primary buttons with a more pronounced shadow (0px 10px 30px rgba(216, 27, 96, 0.2)) to draw immediate attention.

Glassmorphism is used sparingly for navigation bars and overlay headers on profile images to maintain legibility without cluttering the visual field.

## Shapes
The shape language is overtly **Rounded and Friendly**. 

- **Standard Elements:** Buttons and input fields use a base `0.5rem` radius.
- **Cards:** Profile and content cards use a more generous `1.5rem (24px)` radius to feel approachable and modern.
- **Avatars:** User photos are always circular to emphasize the "social" nature of the app.
- **Interactive States:** On hover or tap, elements should subtly scale (1.02x) rather than just changing color, reinforcing the "vibrant" brand personality.

## Components
- **Buttons:** Primary buttons use a subtle vertical gradient from the Primary color to the Tertiary color (#D81B60 to #8E24AA). They are large (56px height) with `rounded-xl` corners. Secondary buttons use a transparent background with a 1.5px Primary border.
- **Cards:** The "Match Card" is the hero component. It features a full-bleed image with a 24px corner radius. Metadata (Name, Age) is overlaid at the bottom using a subtle dark-to-transparent gradient and white typography.
- **Chips:** Used for interests or tags. These use a light tint of the Primary color with Primary-colored text, utilizing a pill-shape (`rounded-xl`).
- **Reward Badges:** These are small, circular or pill-shaped components in Gold (#FFD700) with dark icon labels to denote "Match points" or "Earnings."
- **Input Fields:** Minimalist design with a 1px #E0E0E0 border that transitions to a Primary color border on focus. Labels are always visible above the field in `label-sm`.
- **Lists:** Clean, borderless list items separated by 8px of whitespace rather than lines, using `body-md` for primary text.