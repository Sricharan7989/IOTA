# Team photos

Drop team member photos in **this folder**.

Anything in `public/` is copied to the site root as-is at build time, so a file
saved here as `alpha.jpg` is served at `/team/alpha.jpg`. That is the path you
put in `src/data/team.js`.

## Adding someone's photo

1. Save the image in this folder. **Name it after that person's `id`** in
   `src/data/team.js` — `coordinator.jpg`, `exec-technical.jpg`,
   `member-ai-ml.jpg`. Nothing enforces this, but matching them means you can
   always tell which file belongs to whom.
2. Open `src/data/team.js`, find that person, and set their `photo`:

   ```js
   photo: '/team/member-ai-ml.jpg',
   ```

   The leading slash matters. `team/...` without it will break on any page
   that is not the site root.

## What the image should be

| | |
| --- | --- |
| Shape | **Square.** It is cropped to a circle, so anything else loses its edges. |
| Size | 600 × 600 is plenty. The largest it ever renders is 88px, at 2x. |
| Format | `.jpg` for photos, `.webp` if you can make one, `.png` only if it needs transparency. |
| Weight | Keep under ~200 KB each. Thirteen of these load on one section. |
| Framing | Face centred, a little headroom. The circle crops the corners hard. |

## If there is no photo

Leave `photo: ''`. The card falls back to the gradient monogram — the person's
initials on the blue-violet circle — which is a deliberate design, not a
placeholder. A team with some photos and some monograms looks fine.

The same fallback catches a **broken** path: if the file is missing or the name
is misspelled, the card shows the monogram rather than a broken-image icon. So
a typo here degrades quietly, and you may not notice it. If someone's photo is
not showing, check the filename against the `photo` value first.

## Note

This README is inside `public/`, so it is published with the site at
`/team/README.md`. That is harmless — but do not put anything private in this
folder, because everything in it is public.
