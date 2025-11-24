# Malte Schäfer — Personal Website

This repository contains the source for my personal academic website, built with Jekyll and GitHub Pages. It customizes the Minimal Light theme with a new layout and visual system while keeping content in Markdown/HTML includes.

## Stack
- Jekyll (GitHub Pages compatible)
- Remote theme: `yaoyao-liu/minimal-light`
- Custom layout: `_layouts/default.html`
- Styling: `_sass/minimal-light.scss` compiled via `assets/css/style.scss`
- Content: `index.md` with section includes under `_includes/`

## Local setup
1. Install Ruby (with Bundler) and Jekyll.
2. Install dependencies: `bundle install`
3. Run locally: `bundle exec jekyll serve --livereload`
4. Build: `bundle exec jekyll build` (output in `_site/`)

## Project structure
- `index.md` — landing page content and section ordering
- `_layouts/default.html` — page shell, navigation, and theme toggle
- `_sass/minimal-light.scss` — design tokens, layout, and component styles
- `_includes/` — section content (publications, teaching, talks, etc.)
- `assets/` — images, downloads, and JS (`assets/js/theme.js` for theme toggle)
- `_config.yml` — site metadata and links

## Customization
- Update site metadata in `_config.yml` (title, role, links, analytics).
- Tweak colors, typography, and spacing in `_sass/minimal-light.scss` (see `DESIGN_NOTES.md`).
- Edit content directly in `index.md` or the partials in `_includes/`.

## Deployment
The site is set up for GitHub Pages. Pushing to `main` will trigger the Pages build using the remote theme and this repository’s overrides.

## Testing
- Primary check: `bundle exec jekyll build`
- Manual: open `_site/index.html` or run `bundle exec jekyll serve` and verify navigation, links, and responsive layout.
