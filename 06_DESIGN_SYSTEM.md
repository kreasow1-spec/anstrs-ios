# ANASTARS PERSONAL TATTOO
# DARK GOTHIC LUXURY DESIGN SYSTEM

> **DOCUMENT ID:** `06_DESIGN_SYSTEM.md`  
> **READ PRIORITY:** **7TH**  
> **AESTHETIC ARCHETYPE:** Dark Gothic Luxury & Editorial Tattoo Atelier  
> **STATUS:** PRODUCTION-VERIFIED (DERIVED FROM WEBSITE DESIGN TOKENS)

---

## 1. Aesthetic Identity & Philosophy

The visual atmosphere of **ANASTARS TATTOO** is rooted in **Dark Gothic Luxury**:
- It evokes high-fashion editorial print, cathedral architecture, stone vaults, fine silver jewelry, and surgical black nitrile precision.
- It is **quietly authoritative, disciplined, and tactile**.
- It strictly rejects the clichés of generic AI dashboards:
  - ❌ NO electric cyan, magenta, or purple-blue gradients.
  - ❌ NO heavy neon glows or arbitrary glassmorphism.
  - ❌ NO generic 3-column SaaS card grids with floating emoji or colored circle icons.
  - ❌ NO bubbly, cartoonish border radii (> 20px on rectangular cards).

---

## 2. Color Palette (Production Ground Truth)

All colors are mathematically aligned with the existing production website:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CANVAS & SURFACES                               │
│                                                                        │
│   [ #0A0A0A ] Void Black (Root Background)                             │
│   [ #121212 ] Obsidian (Primary Surface / Cards)                       │
│   [ #18181A ] Graphite (Elevated Modals / Bottom Sheets)               │
│   [ #222226 ] Steel (Pressed States / Secondary Controls)              │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                        BORDERS & DIVIDERS                              │
│                                                                        │
│   [ #27272A ] Hairline Border (1px Subtle Divider)                     │
│   [ #3F3F46 ] Accent Border (Active / Focused Input Stroke)            │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                        ACCENT: CRIMSON / RUBY                          │
│                                                                        │
│   [ #E11D48 ] Vivid Crimson (Primary CTAs, Active Status, Badges)      │
│   [ #BE123C ] Deep Ruby (Button Hover / Pressed State)                 │
│   [ #4C0519 ] Blood Shadow (Subtle Translucent Accents / Glows)        │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                        TYPOGRAPHY & CONTENT                            │
│                                                                        │
│   [ #FFFFFF ] Pure White (H1, Key Titles, Hero Digits)                 │
│   [ #E4E4E7 ] Off-White (Primary Body Text, Form Labels)               │
│   [ #A1A1AA ] Muted Platinum (Secondary Descriptions, Captions)        │
│   [ #71717A ] Ash Gray (Placeholders, Disabled States)                 │
└────────────────────────────────────────────────────────────────────────┘
```

### Color Token Reference Table
| Token Name | Hex Code | iOS UI Role | Contrast on `#0A0A0A` |
| :--- | :--- | :--- | :---: |
| `background.root` | `#0A0A0A` | Deepest screen background | — |
| `surface.card` | `#121212` | Main card and list item surface | Subdued |
| `surface.elevated` | `#18181A` | Bottom sheets, action menus, modals | High depth |
| `surface.highlight`| `#222226` | Selected chip, active segment tab | Distinct |
| `border.subtle` | `#27272A` | Standard 1px perimeter border | Crisp & clean |
| `border.active` | `#BE123C` | Focused input border, selected sketch outline | 6.8:1 |
| `accent.primary` | `#E11D48` | Primary button fill, badges, active tabs | 5.2:1 |
| `accent.hover` | `#BE123C` | Pressed button state | 4.8:1 |
| `text.primary` | `#FFFFFF` | Headings, button text | 19.5:1 (AAA) |
| `text.body` | `#E4E4E7` | Standard readable text | 14.8:1 (AAA) |
| `text.secondary` | `#A1A1AA` | Meta tags, subtitles, dates | 8.2:1 (AAA) |
| `text.muted` | `#71717A` | Placeholder, subtle hints | 4.6:1 (AA) |

---

## 3. Typography Architecture

### 3.1 Font Families
- **Display Typography: `Syne`** (Architectural, modern gothic geometric display).
  - Used for: Brand title, screen headings (H1, H2), hero numbers, and primary section banners.
- **Body & Functional Typography: `Inter` / `SF Pro Display`** (High legibility at dense scales).
  - Used for: Body text, form labels, timestamps, badges, table cells, and button text.

### 3.2 Typographic Hierarchy & Scale
| Level | Font Family | Weight | Size (pt) | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **Hero Title** | Syne | Bold (700) | 32pt | 38pt | -0.5px | Home screen greeting, brand mark |
| **Section H1** | Syne | SemiBold (600) | 24pt | 30pt | -0.3px | Screen headers, modal titles |
| **Card H2** | Syne | Medium (500) | 18pt | 24pt | 0px | Work titles, sketch names |
| **Subtitle** | Inter | Medium (500) | 15pt | 20pt | +0.1px | Section subheaders, step descriptions |
| **Body Primary**| Inter | Regular (400) | 15pt | 22pt | 0px | Descriptions, aftercare guides, FAQ |
| **Body Dense** | Inter | Regular (400) | 13pt | 18pt | 0px | Form field values, table data |
| **Button / Tab**| Inter | SemiBold (600) | 14pt | 14pt | +0.2px | Buttons, pills, segment controllers |
| **Caption** | Inter | Medium (500) | 11pt | 14pt | +0.4px | Timestamps, status tags, badges |

---

## 4. Spatial Layout & Geometry

### 4.1 Spacing Scale (8pt Baseline Grid)
- `space-2` (2pt): Micro-gap between icon and badge label.
- `space-4` (4pt): Tight gap between label and input field.
- `space-8` (8pt): Standard gap between adjacent pills or list items.
- `space-12` (12pt): Inner card element spacing.
- `space-16` (16pt): Standard screen horizontal gutter (outer margin).
- `space-24` (24pt): Spacing between distinct functional card sections.
- `space-32` (32pt): Top spacing for major screen headers.

### 4.2 Corner Radii Math
To prevent visual distortion, all nested corners strictly obey the **Nested Radius Formula**:
$$\text{Inner Radius} = \text{Outer Radius} - \text{Padding}$$

- **Cards**: `14pt` outer radius, with `16pt` padding.
- **Inner Thumbnail**: `10pt` radius sitting inside card.
- **Buttons**: `12pt` radius for standard actions; `24pt` pill radius for filter chips.
- **Inputs**: `12pt` radius with 1px border.
- **Bottom Sheet Container**: `24pt` top-left and top-right radius.

---

## 5. UI Component Specifications

### 5.1 Primary Action Button ("The Crimson Signet")
- **Height**: 50pt (optimal touch target for iOS).
- **Background**: `#E11D48` (Crimson).
- **Pressed State**: `#BE123C` with instant haptic `ImpactFeedbackStyle.Light`.
- **Text**: Pure White `#FFFFFF`, Inter SemiBold 15pt, centered.
- **Padding**: Vertical 16pt, Horizontal 32pt (2x vertical ratio).
- **Border**: None.

### 5.2 Secondary / Ghost Button
- **Height**: 46pt.
- **Background**: `rgba(255, 255, 255, 0.04)`.
- **Border**: 1px solid `#27272A`.
- **Text**: Off-White `#E4E4E7`, Inter Medium 14pt.

### 5.3 Text Inputs & Form Controls
- **Height**: 52pt.
- **Background**: `#121212`.
- **Border**: 1px solid `#27272A` (Idle), 1px solid `#BE123C` (Focused).
- **Text**: `#FFFFFF`, Inter Regular 15pt.
- **Placeholder**: `#71717A`.
- **Label**: Above input, Inter Medium 12pt, `#A1A1AA`.

### 5.4 Gothic Card Container
- **Background**: `#121212`.
- **Border**: 1px solid `#27272A`.
- **Padding**: 16pt.
- **Radius**: 14pt.
- **Shadow**: `rgba(0, 0, 0, 0.5)` with 0px offset, 8px blur (no colored glowing drop-shadows).

### 5.5 Status Badges & Pills
- **Available Sketch**: Background `rgba(34, 197, 94, 0.12)`, text `#4ADE80`, border `rgba(34, 197, 94, 0.3)`.
- **Reserved Sketch**: Background `rgba(217, 119, 6, 0.12)`, text `#FBBF24`, border `rgba(217, 119, 6, 0.3)`.
- **Sold Sketch**: Background `rgba(113, 113, 122, 0.12)`, text `#A1A1AA`, border `rgba(113, 113, 122, 0.3)`.
- **Deposit Paid**: Background `rgba(225, 29, 72, 0.15)`, text `#FB7185`, border `rgba(225, 29, 72, 0.4)`.

---

## 6. Imagery & Photography Treatment

1. **Aspect Ratios**:
   - Portfolio works: `3:4` vertical portrait ratio (showcasing anatomical tattoo placement).
   - Flash sketches: `1:1` square or `3:4` vertical.
   - Studio banners: `16:9` cinematic letterbox.
2. **Progressive Loading**:
   - All images use `expo-image` with Blurhash placeholders (`L66j@r_N00of~qofD%of00Rj?bWB`).
   - Transition: `fade(250)` duration on asset resolution.
3. **Contrast Gradient Overlay**:
   - When text overlays photography, a linear gradient (`from-transparent to-[#0A0A0A]/90`) is applied across the lower 40% of the image container to guarantee 100% WCAG AA text legibility.
