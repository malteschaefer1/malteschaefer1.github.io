# Design Notes

## Palette
- Background: `--bg #f6f7fb`
- Surface/card: `--surface #ffffff`
- Text: `--text #1b2733`, Muted: `--muted #5a6b7b`
- Accent: `--accent #2f5ae8`, Hover/strong: `--accent-strong #1f3fae`
- Border/subtle: `--border #dce3ed`, `--subtle #e6ebf3`
- Dark theme overrides are defined under `[data-theme="dark"]`.

## Typography
- Font: Manrope (400/500/600/700)
- Headings: tight letter spacing, `h2` at 1.35rem, `h1` drawn from the header block.
- Body: line-height 1.7 for comfortable reading.

## Layout
- Max content width: 1200px with generous padding.
- Sections are card-like blocks (`.section`) with rounded corners, light borders, and soft shadows.
- Header contains identity, quick links, navigation, and a theme toggle.

## Components
- Chips (`.chip`) for quick contact links.
- Navigation pills (`.site-nav a`) for smooth anchor navigation.
- Publications/teaching/talks are rendered in `.pub-row` grid cards with teaser images and action buttons.
- News entries use `.news-list` with date badges and outlined cards.

## Styling entry points
- Core styles: `_sass/minimal-light.scss`
- Theme toggle behavior: `assets/js/theme.js`
- Content ordering: `index.md`
