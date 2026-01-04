# Style Guide

This site uses a bold Vietnam-flag-inspired visual system (red + yellow) with warm paper neutrals. Use the theme tokens and patterns below to keep the UI consistent.

## Theme Tokens
Source of truth: `app/globals.css`.

### Core palette
- `--flag-red`: #da251d
- `--flag-red-deep`: #a51717 (light) / #ff9b4a (dark)
- `--flag-yellow`: #ffde00

### Neutrals and surfaces
- `--paper`: #fff3cc (light) / #0e0a0a (dark)
- `--paper-soft`: #fff8e6 (light) / #161111 (dark)
- `--surface`: #ffffff (light) / #1a1212 (dark)
- `--surface-muted`: #fff6d6 (light) / #231818 (dark)
- `--border`: #e4d7bf (light) / #3a2a2a (dark)
- `--ink`: #240f10 (light) / #f5ede0 (dark)
- `--ink-muted`: #6b5356 (light) / #d8cbb8 (dark)

## Light and Dark Mode
- Theme switch is stored in `localStorage` under the `theme` key.
- `data-theme` on the `html` element controls token overrides.
- The default is light; if no preference is stored, system preference is used.

## Typography
- System default stack for body and headings: `system-ui, -apple-system, "Segoe UI", sans-serif`.
- Headings use the same font with higher weight.
- Use tabular numbers in tables where possible.

## Layout and Spacing
- 8px spacing grid.
- Section spacing: 48-64px.
- Cards use rounded corners and strong borders; primary sections use a top border in red.

## Components

### Cards
- Border: `border-2 border-[var(--border)]`
- Background: `bg-[var(--surface)]`
- Hero variant: add `border-t-4 border-t-[var(--flag-red)]`
- Shadow: warm red-leaning shadow for emphasis

### Buttons and Pills
- Active pill: red background + yellow text.
- Inactive pill: surface background + border + muted ink.

### Filters and Inputs
- Wrappers use `focus-within` rings in yellow and red for focus cues.
- Inputs and selects use transparent backgrounds with ink text.

### Tables
- Header rows should use red or warm paper tones.
- Zebra rows use subtle yellow tint where needed.

## Motion
- Use `.stagger` on page section containers for fade-rise entry.
- Respect `prefers-reduced-motion`.

## Background Accents
- Use soft diagonal shapes with blur in the layout background.
- Keep accents subtle (opacity around 0.2-0.3).

## Do and Do Not
- Do: use token variables for color, not raw hex in components.
- Do: keep contrast strong for red/yellow on light surfaces and avoid glare.
- Do not: introduce new base colors without updating token definitions.
- Do not: use purple or dark-mode-first styling.

## References
- Theme tokens: `app/globals.css`
- Theme switcher: `app/theme-toggle.tsx`
