# CSS Bundler Demo

A small frontend project demonstrating a bundler-based CSS pipeline where
multiple source files are collected, transformed, and emitted as a single
output file that does not correspond 1-to-1 to the original sources.
CSS source maps are enabled so DevTools can trace every rule back to its
original file and line.

## Setup and run

**Prerequisites:** Node.js 18+ and npm.
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production 
npm run build

# Preview the production build locally
npm run preview
```

Development server runs at **http://localhost:8080**.

## How authored CSS becomes final CSS

The project has four source files:

| File | Role |
|---|---|
| `src/css/variables.css` | CSS custom properties (design tokens) |
| `src/css/base.css` | Reset and body styles |
| `src/css/components.css` | Component styles using **CSS nesting** |
| `src/css/app.css` | Entry point - imports the three files above |

The transformation pipeline:

1. **Entry** - `src/main.js` imports `src/css/app.css`. That file uses
   `@import` to pull in the other three files.

2. **Bundling** - Webpack resolves all `@import` statements and passes
   the concatenated CSS through a loader chain (`css-loader` →
   `postcss-loader` → `MiniCssExtractPlugin`). The result is one output
   file whose line numbers and structure differ from any individual source.

3. **PostCSS transformations** - Two plugins run on the combined CSS:
   - **postcss-nesting** - flattens nested rules from `components.css`
     into separate selectors. For example, `.card { &:hover { ... } }`
     becomes `.card:hover { ... }` in the output.
   - **Autoprefixer** - adds vendor-prefixed declarations where needed
     (e.g. `-webkit-background-clip` alongside `background-clip`).

4. **Source maps** - `devtool: 'source-map'` in Webpack config combined
   with `sourceMap: true` on both `css-loader` and `postcss-loader`
   produces a `.css.map` file. It maps every line of the generated CSS
   back to the correct original file and line number.

**Summary:** `src/css/*.css` (4 files, with nesting) → Webpack bundles →
PostCSS flattens nesting + adds prefixes → `dist/assets/main.<hash>.css`
(1 file, flat selectors). Source maps link the output back to the sources.

## Generated CSS and source maps

After `npm run build`, check `dist/assets/`:

- **`main.<hash>.css`** - the final CSS the browser loads. All `@import`s
  are resolved, nesting is flattened, prefixes are added.
- **`main.<hash>.css.map`** - the source map. The last line of the CSS
  file contains `/*# sourceMappingURL=main.<hash>.css.map */` so the
  browser knows where to find it.

The `.css.map` file has a `sources` array listing all four original files:
```json
"sources": [
  "webpack://css-bundler-demo/./src/css/variables.css",
  "webpack://css-bundler-demo/./src/css/base.css",
  "webpack://css-bundler-demo/./src/css/components.css",
  "webpack://css-bundler-demo/./src/css/app.css"
]
```

To verify in the browser: open DevTools → inspect any element →
**Styles** panel → each CSS rule shows a filename and line number link
(e.g. `components.css:6`). Clicking it opens the original source file,
not the generated bundle.