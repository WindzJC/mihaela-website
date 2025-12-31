# Mihaela S. Hegstrom — Static Site

## Edit content
- Hero + About: `index.html`
- Books list and modal data: `index.html` (search for `bookCard`)
- Media links: `index.html` (section `#media`)
- Contact email placeholder: `index.html` (search for `CHANGE-ME@example.com`)

## Replace images
Keep filenames and overwrite files to avoid changing code paths.

- Author photo: `assets/mihaela.jpg`
- Book covers:
  - `assets/books/praises-in-the-storm.jpg`
  - `assets/books/the-mysteries-of-my-soul.jpg`
  - `assets/books/grace-and-truth.jpg`

If you add new images, place them under `assets/` and update the `src` paths in `index.html`.

## Cloudflare Pages deploy
- Build command: **none**
- Output directory: **/**
- Framework preset: **None**

Deploy by pushing to the connected GitHub repo.

## Notes
- The site is fully static (HTML/CSS/JS only).
- Theme preference is saved in `localStorage`.
- The contact form copies a formatted message to the clipboard; no backend required.
