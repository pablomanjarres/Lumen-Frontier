# Lumen Frontier — Design System

**Aesthetic: "Old Money" luxury — RESTRAINT, not flash.** Warm palette on a dark warm base,
elegant serif display, hairline borders, flat rich surfaces, one soft shadow. If a choice adds
visual noise, it is wrong.

This is a **contract**. Every screen/component built after this must use these tokens and rules.
Tokens live in `tailwind.config.mjs`, `src/styles/global.css`, `constants/config.ts`, and the
widget registry. Do not invent new colors, radii, shadows, or ad-hoc spacing.

---

## 1. Palette — warm ramps ONLY

Five ramps (each `50…950`), plus semantic surfaces. **No generic Tailwind
blue / green / purple / slate / sky / gray / indigo / amber / orange / pink / rose / cyan / teal / emerald / yellow / red — anywhere.**

| Ramp | Meaning |
|------|---------|
| `brass` (accent `#e99218`) | **The one accent.** Primary actions, focus, links, active state, "medium" priority, highlights. |
| `burgundy` | **Danger / destructive / "high".** Errors, delete, high priority, deep emphasis. |
| `forest` | **Success / positive / "low".** Confirmations, growth, low priority, calm. |
| `cognac` | Warm **neutral** (leather). Secondary tone, muted chrome, dividers-with-weight. |
| `ivory` | Warm **text** ramp + light chips. Drives the three text roles. |

**Semantic surfaces** (flat, warm "night" — use instead of tri-color gradients):

| Token | Use |
|-------|-----|
| `surface-base` `#1a1413` | Page background (set on `body`). |
| `surface-raised` `#221a16` | Cards, panels, bars. |
| `surface-overlay` `#2b211c` | Modals, popovers, dropdowns. |
| `surface-sunken` `#120d0b` | Inputs, wells, insets. |

**Map old colors → warm:** green→`forest`, red→`burgundy`, blue/indigo/sky→`brass` (or `cognac` for neutral chrome),
purple/pink/rose→`burgundy`, amber/orange/yellow→`brass`, slate/gray→`cognac` / `ivory` / `surface-*`.

## 2. Text — three roles, not alpha soup

Retire `text-white/60`, `text-ivory-200/70`, and the whole `/40…/90` alpha soup. Use exactly three roles
(defined as utilities in `global.css`):

| Class | Color | Use |
|-------|-------|-----|
| `text-primary` | ivory-100 | Headlines, key values, primary body. |
| `text-secondary` | ivory-400 | Supporting body, labels, nav. |
| `text-tertiary` | ivory-600 | Captions, meta, placeholders, disabled. |

A warm token utility (e.g. `text-brass-300`) may override a role for accent text. `body` already defaults to `text-primary` on `surface-base`.

## 3. Typography

| Class | Font | Use |
|-------|------|-----|
| `font-serif` | Cormorant Garamond | **Display / headings.** `h1`/`h2` default to it. Hero text, section titles, large numerals. |
| `font-sans` | Inter | **Body / UI.** Everything else — paragraphs, labels, buttons. `body` default. |
| `font-mono` | Fira Code | Timers, counters, tabular numbers, code, keyboard hints. |

Small UI labels that land on an `h2`/`h3` should add `font-sans`. Don't set serif on tiny text.

## 4. Radius — exactly two

| Class | Value | Use |
|-------|-------|-----|
| `rounded-card` | 8px | Cards, panels, modals, tiles, images, media. |
| `rounded-control` | 6px | Buttons, inputs, selects, chips, small controls. |

**Retire `rounded-lg / xl / 2xl / 3xl`.** `rounded-full` only for genuinely circular elements (avatars, status dots, icon-only round buttons) — use sparingly.

## 5. Elevation — one soft warm shadow

| Class | Use |
|-------|-----|
| `shadow-soft-sm` | Subtle rest (chips, inputs, flat buttons). |
| `shadow-soft` | Cards / panels at rest. |
| `shadow-soft-lg` | Raised: hover, dragging, modals, popovers. |
| `shadow-focus` | Brass focus ring. Pair with `focus-visible:outline-none focus-visible:shadow-focus`. |

**One shadow per element.** No stacking, no colored glows, no `shadow-2xl`.

## 6. Borders — hairline only

1px, brass-tinted: `border border-hairline` (or `border border-brass-900/40`).
**Never `border-2`** (or thicker) for chrome. Emphasis comes from color/spacing, not heavy strokes.

## 7. Spacing — a real scale

- Stay on the 4px grid: `1, 2, 3, 4, 6, 8, 10, 12, 16` (`p-4`, `gap-6`, `mt-8`…).
- **No improvisation:** no `p-2.5`, `px-0.5`, `m-1.5`, `gap-[7px]`.
- Semantic aliases: `p-gutter` (24px) = standard card/section inner padding; `py-section` (64px) = vertical rhythm between major sections.

## 8. Surfaces & gradients — flat and rich

Panels, cards, bars, modals = **flat** `surface-*` color + one `border-hairline` + one `shadow-soft*`.
**Stop the gradient-on-everything.** The only sanctioned gradient is the small widget icon chip, whose
warm value comes from the registry. No full-panel tri-color gradients, no gradient text unless it is a single warm brand moment.

## 9. Motion

Global `prefers-reduced-motion` guards exist in `global.css` and every layout — respect them.
Keep transitions short and quiet (`transition-colors`, ~150–200ms). No bouncing, shimmering, or infinite loops on UI chrome.

---

## Copy-paste recipes

```html
<!-- Card / panel -->
<div class="bg-surface-raised border border-hairline rounded-card shadow-soft p-gutter">…</div>

<!-- Primary button (brass plaque: gold bg, near-black text) -->
<button class="bg-brass-500 hover:bg-brass-600 text-surface-base font-medium rounded-control px-4 py-2
               shadow-soft-sm transition-colors focus-visible:outline-none focus-visible:shadow-focus">Save</button>

<!-- Secondary button (quiet) -->
<button class="bg-transparent border border-hairline text-secondary hover:text-primary hover:border-brass-700/60
               rounded-control px-4 py-2 transition-colors">Cancel</button>

<!-- Input -->
<input class="bg-surface-sunken border border-hairline rounded-control px-3 py-2 text-primary
              placeholder:text-tertiary focus-visible:outline-none focus-visible:shadow-focus" />

<!-- Chip / badge -->
<span class="bg-brass-500/15 text-brass-300 border border-brass-500/30 rounded-control px-2 py-1 text-xs">Focus</span>

<!-- Modal / popover -->
<div class="bg-surface-overlay border border-hairline rounded-card shadow-soft-lg p-gutter">…</div>

<!-- Section heading (serif is the h1/h2 default) -->
<h2 class="text-primary">Your command center</h2>
```

**Semantic status colors:** success/low → `forest`, focus/medium → `brass`, danger/high → `burgundy`.
Prebuilt maps live in `constants/config.ts` (`PRIORITY_COLORS`, `CATEGORY_COLORS`) — reuse them, don't re-derive.

## Where things live

| Concern | File |
|---------|------|
| Colors, surfaces, fonts, radius, shadow, spacing | `tailwind.config.mjs` |
| Dark warm base, 3 text roles, reduced-motion | `src/styles/global.css` (imported by `Layout.astro` + `lumenverse.astro`) |
| Fonts loaded (serif + Inter + mono) | `src/layouts/{LandingLayout,Layout,FullscreenLayout}.astro` |
| Widget accent colors (warm) | `src/features/lumen-os/dashboard/services/widgetRegistry.ts` (canonical). `src/services/widgetRegistry.ts` is a re-export shim. |
| Priority / category semantics | `src/features/lumen-os/dashboard/constants/config.ts` |

## Known legacy debt (migrate as you touch these — not this foundation's job)

- **`index.astro`** (landing) still uses `Space Grotesk` + a blue/purple gradient hero title. Migrate display type to `font-serif` and rewarm the gradient. Space Grotesk is loaded **only** in `LandingLayout` for this reason — remove it when the landing is redone.
- **`EmptyDashboard.astro`, `EditModeIndicator.astro`, `Dashboard.tsx` empty-state** use white "liquid glass" + `from-blue-500 to-purple-500` + `border border-white/30` + `rounded-3xl`. The leftover `.glass-button / .glass-empty-state / .glass-indicator / .shadow-glass-lg` in `dashboard.astro` exist ONLY to keep these rendering — delete them once these components move to warm surfaces.
- **`WidgetMarketplace.tsx`** uses a tri-color gradient panel + `border-2`. Flatten to `bg-surface-*` + `border-hairline`.
- **`WidgetSettings.tsx` + widget internals** are still light-mode (`bg-white`, `text-slate-700`, `focus:ring-green-500`, `rounded-2xl`). Convert to surfaces + roles + warm focus.
- **`AnimatedBackground.astro`** uses `bg-purple-300 / blue-300 / pink-300` blobs. Rewarm to brass/cognac/burgundy or retire.
