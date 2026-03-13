# HTML, CSS and DaisyUI components

- Check if a DaisyUI component exists before writing anything custom. Use the installed DaisyUI Docs to find components. Use Tailwind for structure and layout if no DaisyUI component exists.
- Use DaisyUI utility classes like `bg-primary` so that the colors are used. Use the DaisyUI Docs to find utility classes. Never use Tailwind colors.
- Simplicity over pixel perfectness: Prefer DaisyUI classes and components and avoid adding custom padding and margin like `pb-4` or `mx-2` unless strictly necessary to accomplish the design.
- Use Astro components where possible, only resort to React components if interactivity is required. Use Astro slots to pass interactive components to Astro components, like so:

```astro
<MyAstroComponent>
  <h1>Static Astro Content</h1>
  <MyInnterActiveReactComponent client:load />
</MyAstroComponent>
```

# Graphql

- Only fetch fields strictly necessary for the component.
- Use graphql tada.
