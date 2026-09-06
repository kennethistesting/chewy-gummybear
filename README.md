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
pnpm exec tsc --noEmit
node --experimental-strip-types --test tests/gummy-geometry.test.mjs
```

Built with React, Three.js, Vinext, and Tailwind CSS. The existing Sites configuration is in `.openai/hosting.json`.
