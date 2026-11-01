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

## Sources and materials

`data/materials.json` describes each source, its author, retrieval date, original URL, local file, PDF page count and SHA-256 checksum. `public/materials/` contains unchanged source PDFs and extracted text. The site provides individual material pages, PDF inspection, downloads and optional text inspection. PDF page references count physical pages, including repeated slide overlays, rather than printed slide counters. Scanned handwritten slides are explicitly marked when no usable text could be extracted.

Conference summaries and talk records cite material IDs and PDF pages. Text extraction can lose mathematical notation and diagrams, so consult the PDF when those matter. Remote-only documents are explicitly marked; an original-host link is the exception to internal navigation when a local copy could not be retrieved. Historical record excerpts are not represented as complete programmes. Do not describe a programme as complete unless the full source was checked.

Run `npm test` with Chromium installed to check routes, internal navigation, source-page exceptions, conference search, PDF provenance, text inspection and mobile layouts.
