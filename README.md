# Yummy Gummy

An interactive Three.js gummy bear playground. Poke and stretch the bear, switch between five fruit flavors, and bounce it to release matching fruit particles.

## Run locally

Requires Node.js 22.13 or newer and pnpm.

```sh
pnpm install
pnpm dev
```

Open the local URL printed by the development server.

## Build and checks

```sh
pnpm build
pnpm test
pnpm preview
```

Built with Vite, React, Three.js, and Tailwind CSS. `src/App.tsx` contains the playground, `src/globals.css` its styles, and `lib/gummy-geometry.ts` the shared geometry helper.

## GitHub Pages

Vite builds a static site into `dist/`, with the base path `/chewy-gummybear/`. The build includes a real `dist/index.html`; no server runtime or prerendering is required.

Pushes to `main` (or a manual workflow run) test and build the site, then deploy `dist/` using `.github/workflows/deploy-pages.yml`. In repository Settings → Pages, the source must be GitHub Actions.

Live site: https://kennethistesting.github.io/chewy-gummybear/
