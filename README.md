# Triglav's Oracle

A three-headed Wikipedia rabbit hole, themed around the Slavic god Triglav.

🔮 **Live demo:** https://triglav-wisdom-trails.lovable.app

You enter a word, and the app builds a short "journey" of related Wikipedia pages — then lets you explore it through three aspects of Triglav, each pulling the trail in its own direction.

## The three heads

- **Svarog's Forge** — the celestial head. Creation, light, beauty, and high‑minded connections.
- **Perun's Strike** — the storm. Direct, grounded, obvious links and mainstream topics.
- **Veles' Depths** — the underworld. Shadowy, sideways, and sometimes unsettling associations.

Click any result to dive deeper — the chosen title becomes the next query, and the trail grows.

## How it works

Everything runs client-side in the browser. There is no backend, no database, no auth, no `localStorage` — refresh and the journey resets.

Each path queries the public Wikipedia APIs:

- `https://en.wikipedia.org/w/api.php` with `action=query&list=search` for search
- `https://en.wikipedia.org/api/rest_v1/page/summary/{title}` for short extracts

To skew results thematically, **Svarog** and **Veles** quietly append a random keyword to the user's query (e.g. `harmony`, `festival` for Svarog; `occult`, `forbidden` for Veles). **Perun** searches the term as-is — he's the honest one.

## Tech stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) with a custom HSL-based design system
- [shadcn/ui](https://ui.shadcn.com/) component primitives
- Built with [Lovable](https://lovable.dev)

## Project structure

```
src/
├── components/
│   ├── ResultCard.tsx       # A single Wikipedia result card
│   ├── path-column.tsx      # One of the three head columns
│   ├── journey-trail.tsx    # Breadcrumb trail of dives
│   ├── search-input.tsx     # The main query input
│   └── ui/                  # shadcn/ui primitives
├── lib/
│   └── wikipedia.ts         # Wikipedia API client + path keyword logic
├── pages/
│   ├── Index.tsx            # Main app screen
│   └── NotFound.tsx
└── index.css                # Design tokens (HSL)
```

## Credits

- Inspired by [Triglav](https://en.wikipedia.org/wiki/Triglav_(mythology)), the three-headed god of Slavic mythology.
- Article data from [Wikipedia](https://www.wikipedia.org/), under [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/).
- Bootstrapped and iterated with [Lovable](https://lovable.dev).

## License

[MIT](./LICENSE) 
