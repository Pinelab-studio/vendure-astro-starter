# HTML, CSS and DaisyUI components
- Check if a DaisyUI component exists before writing anything custom. Use the installed DaisyUI Docs to find components. Use Tailwind for structure and layout if no DaisyUI component exists.
- Use DaisyUI utility classes like `bg-primary` so that the colors are used. Use the DaisyUI Docs to find utility classes. Never use Tailwind colors.
- Simplicity over pixel perfectness: Prefer DaisyUI classes and components and avoid adding custom padding and margin like `pb-4` or `mx-2` unless strictly necessary to accomplish the design.

# Graphql
* Only fetch fields strictly necessary for the component.
* Use graphql tada.