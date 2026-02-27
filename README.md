# MK Website

This repository contains the website for MK. The
primary goal of the current implementation is simplicity, performance, and
maintainability. No frameworks or build tools are required; the site runs
on plain HTML/CSS with an optional `main.js` for future enhancement.

## Structure

- `index.html` - main landing page. Contains sections such as About, Work,
  Links, and the Latest Video placeholder.
- `videos.html` - dedicated page for embedding multiple videos. Keeps the
  main page lean and focuses analytics on video views.
- `style.css` - single stylesheet shared across pages. Contains layout rules,
  theming, and responsive adjustments.
- `main.js` - intentionally empty; reserved for any client logic that may be
  needed later (e.g. dynamic video loading).
- `data/latest.json` - holds metadata for the most recent video. Used to
  decouple content updates from markup changes.
- `assets/icons` - SVG icons used for social/music links.

## Commenting Philosophy

As a professional engineering practice, comments in this project aim to
explain *why* a decision was made rather than *what* the code does.
Clean, self-documenting code is preferred, but comments provide context
for:

- Architectural or performance trade-offs
- Non-obvious styling choices (e.g. breakpoints, blur effects)
- Reasons for maintaining separate pages or files
- Future expansion plans (e.g. placeholder JS file)

Avoid over-commenting trivial code; update comments when the code evolves.

