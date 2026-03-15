# Task #2 – DevTools CSS Investigation

## Element

**`h1` inside `.header`** — page title with gradient text effect.
Non-trivial styling: the visible color comes from a `background` gradient
clipped to text shape via `background-clip: text` and `color: transparent`.
Final computed values result from cascade, CSS custom properties, and
vendor-prefixed declarations authored alongside standard ones.

---

## Five properties

### 1. `font-size`
- **Computed:** `28px`
- **Styles panel:** `font-size: 1.75rem` in `.header h1`
- **Generated CSS location:** `app.css:13`
- **Source map trace:** → `src/css/app.css:13`

### 2. `font-weight`
- **Computed:** `700`
- **Styles panel:** `font-weight: 700` in `.header h1`
- **Generated CSS location:** `app.css:13`
- **Source map trace:** → `src/css/app.css:13`

### 3. `color`
- **Computed:** `rgba(0, 0, 0, 0)` (transparent)
- **Styles panel:** `color: transparent` in `.header h1`
- **Generated CSS location:** `app.css:13`
- **Source map trace:** → `src/css/app.css:13`

### 4. `background-clip`
- **Computed:** `text`
- **Styles panel:** `background-clip: text` and `-webkit-background-clip: text` in `.header h1`; the prefixed variant is struck through, overridden by the standard property
- **Generated CSS location:** `app.css:13`
- **Source map trace:** → `src/css/app.css:13`; both the standard and prefixed variants are present in the authored source

### 5. `font-family`
- **Computed:** `system-ui, -apple-system, sans-serif`
- **Styles panel:** `font-family: var(--font-sans)` inherited from `body`
- **Generated CSS location:** `base.css:8` (start of `body` rule; `font-family` on line 10)
- **Source map trace:** → `src/css/base.css:10` (usage); variable value defined in `src/css/variables.css`

---

## Three cases where mapping breaks down

**1. All properties in `.header h1` map to the same location.**
DevTools links every property in the rule to `app.css:13` — the opening
line of the selector block. There is no per-property line information,
only per-rule. Finding which exact line an individual declaration comes
from requires opening the source file manually.

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
about variable resolution itself — the resolved value is invisible in
the source.