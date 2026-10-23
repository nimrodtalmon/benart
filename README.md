# Ben's Art

A simple static gallery site, served by GitHub Pages.

## Adding art

1. Put the image file in `art/` (jpg, png, or webp; ideally under ~1 MB).
2. Add an entry to `art/gallery.json` (newest first):

```json
[
  {
    "file": "dragon.jpg",
    "title": "Dragon",
    "year": 2026,
    "medium": "pencil",
    "tags": ["monsters"]
  }
]
```

Only `file` is required. Tags become filter buttons automatically.

## Files

- `index.html`, `style.css`, `app.js` — the site
- `art/` — images and `gallery.json`
