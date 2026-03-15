# Vendure Astro SSR + DaisyUI starter template

This is simple starter template for building an SSR storefront for Vendure with Astro and DaisyUI. It is meant as a starting point and meant to be modified and extended by you, to fit your project. (See the `Customizing - AI is your friend` section for more information.)

## Stack

- Astro (SSR) + React
- DaisyUI
- TailwindCSS
- GraphQL Tada

## Features

- Storefront page
- Product Detail pages
- Product Listing pages
- Checkout
- Stale while revalidate caching (SWR)

## Getting Started

- Set your variables in `config.ts`.
- Set your schema URL in `tsconfig.json` for GraphQL Tada types.
- Add labels for your enabled locales in `translations.ts`
- Create a .env file with the variable `CACHE_INVALIDATION_SECRET=something-random`
- Run `npm run dev` to start the development server

## Customizing - AI is your friend

We have included a set of agents that can help you with the development of your project. Based on [Thinking in React](https://react.dev/learn/thinking-in-react), we work in the following manner:

1. Start with a static mock up. Use this prompt for example: `You are the "@ui-developer-agent.md". Add review stars to the ProductDetailPage, and list reviews at the bottom of the page`.
2. Implement real data, interactivity and state: `You are the "@typescript-developer-agent.md". Fetch reviews from Vendure via GraphQL and map to the reviews UI in the ProductDetailPage. Calculate the average rating based on all reviews and use the value to display the amount of stars.`.

## Cache invalidation

To invalidate the SSR cache entries, you have to call the `/api/invalidate-cache` endpoint of the Vendure API.
// TODO: Add a button to invalidate the cache in the UI.
