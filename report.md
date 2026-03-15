# Task #2 – DevTools CSS Investigation

## Element

**`h1` inside `.header`** - page title with gradient text effect.
Non-trivial styling: visible color comes from a `background` gradient
clipped to text shape via `background-clip: text` and `color: transparent`.
Final computed values result from cascade, CSS custom properties, and
a vendor-prefix injected at build time.

---

## Five properties

### 1. `font-size`
- **Computed:** `28px`
- **Styles panel:** `font-size: 1.75rem` - rule in `.header h1`
- **Generated CSS:** `main.<hash>.css` - rule originates from `app.css` block
- **Source map trace:** → `src/css/app.css`

### 2. `font-weight`
- **Computed:** `700`
- **Styles panel:** `font-weight: 700` - rule in `.header h1`
- **Generated CSS:** same bundle, `app.css` block
- **Source map trace:** → `src/css/app.css`

### 3. `color`
- **Computed:** `rgba(0, 0, 0, 0)` (transparent)
- **Styles panel:** `color: transparent` - rule in `.header h1`
- **Generated CSS:** `app.css` block in bundle
- **Source map trace:** → `src/css/app.css`

### 4. `background-clip`
- **Computed:** `text`
- **Styles panel:** `background-clip: text` - rule in `.header h1`; `-webkit-background-clip: text` also present, struck through
- **Generated CSS:** `app.css` block; `-webkit-` variant injected by Autoprefixer, not present in any source file
- **Source map trace:** → `src/css/app.css` for the standard property; no source location for the prefixed variant

### 5. `font-family`
- **Computed:** `system-ui, -apple-system, sans-serif`
- **Styles panel:** `font-family: var(--font-sans)` - inherited from `body`
- **Generated CSS:** `base.css` block in bundle
- **Source map trace:** → `src/css/base.css` (usage); variable value defined in `src/css/variables.css`

---

## Three cases where mapping breaks down

**1. Autoprefixer-injected properties have no source location.**
`-webkit-background-clip: text` exists in the generated CSS but in none
of the source files - it was inserted by Autoprefixer at build time.
DevTools shows it without a navigable source link. There is no authored
line to point to.

**2. `color: transparent` is misleading without gradient context.**
Computed shows `rgba(0, 0, 0, 0)`, which looks broken in isolation.
The visible gradient text results from three properties working together
(`background`, `background-clip`, `color`). Source maps point to each
property individually but cannot express their visual relationship.

**3. CSS custom properties require two-step tracing.**
`font-family: var(--font-sans)` on `body` resolves to
`system-ui, -apple-system, sans-serif`. Tracing this requires two hops:
`base.css` (where the variable is used) → `variables.css` (where it is
defined). Source maps cover each file correctly but carry no information
about variable resolution itself.