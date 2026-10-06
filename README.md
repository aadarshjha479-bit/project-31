# Project 31

Project 31 is a dark, mission-focused Class 12 CBSE Commerce execution tracker built as a mobile-first PWA.

## Run locally

From the project folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Features

- Dark cinematic mission dashboard
- Project 31 daily task system for Oct 5–31
- Subject and chapter progress tracking
- Points, streaks, and completion status
- Quotes with no-repeat cycle
- Offline support via service worker
- Installable as a PWA
- Local export/import/reset
- Update available handling for future changes

## Deployment

This app is designed to be deployable to GitHub Pages, Netlify, Vercel, or Cloudflare Pages.

## Notes

- Local development does not require HTTPS.
- HTTPS is only needed for public web deployment or PWA install via a public URL.
- Updates are handled through service worker cache versioning.
