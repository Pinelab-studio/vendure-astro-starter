# Vendure Astro SSR + DaisyUI starter template

This is a starter template for building an SSR storefront for Venudre with Astro and DaisyUI.

## Features

- SSR with stale-while-revalidate caching
- DaisyUI
- Astro
- TailwindCSS
- Localization
- TypeScript
- ESLint
- Prettier

## Getting Started

* Set your variables in `config.ts`.
* Set your schema URL in `tsconfig.json` for GraphQL Tada types.
* Add labels for your enabled locales in `translations.ts`
* Create a .env file with the variable `CACHE_INVALIDATION_SECRET=something-random`
* Run `npm run dev` to start the development server

## Customizing


## Cache invalidation

To invalidate the SSR cache entries, you have to call the `/api/invalidate-cache` endpoint of the Vendure API.

