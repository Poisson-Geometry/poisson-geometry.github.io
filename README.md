# Poisson Geometry

React website for the international Poisson geometry community.

## Development

Use Node.js 22 or later. Run `npm ci`, then `npm run build`. The build produces static HTML for every route, with React hydration for conference search and filters. Serve `dist/` with any static server.

## Content

`data/conferences.json` contains the displayed conference records. Source references are preserved separately in the existing `data/dito-international-conference-archive.json` and `data/international-poisson-meetings.json` files. Public conference pages use internal navigation and do not redirect to former event websites. Unknown dates and programmes are explicitly marked.

The historical list contains no 2020 entry; do not infer an event from the biennial pattern. Historical organizing committees do not describe current organization governance.

## Deployment

GitHub Pages serves the committed static files from the repository root on `main`. After changing the source, run `npm run build` and copy `dist/` to the repository root, preserving `src/`, data and this build setup. A deployment from this assistant includes both the source and generated static files in one commit.

The original fish logo is retained in `assets/poisson-fish.png`; Computer Modern Unicode is self-hosted with its license in `fonts/OFL.txt`.
