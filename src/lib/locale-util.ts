
// This util is responsible for loading locale messages and replacing placeholders in template strings.


/**
 * The type of all message functions.
 * Example: `m.welcome()`, `m.hero()` etc.
 */
export type LocaleMessageFunctions<T> = {
  [K in keyof T]: (params: Record<string, string>) => string;
};

/**
 * Creates message functions for each key in messages.json.
 * Example: `m.welcome({ username: "Martijn" })` => `Hello Martijn`
 */
export function createMessageFn<T extends Record<string, string>>(
  messages: T,
): LocaleMessageFunctions<T> {
  const result: Record<keyof T, (params: Record<string, string>) => string> = {} as any;
  for (const key in messages) {
    const template = messages[key as keyof T] as string;
    result[key] = createTemplateFn(template);
  }
  return result;
}

/**
 * Replaces placeholders in a template string with parameters.
 *
 * Example: `Hello {username}` becomes `Hello Martijn` when params is `{ username: "Martijn" }`.
 */
function createTemplateFn(
  template: string,
): (params: Record<string, string>) => string {
  return (params: Record<string, string>) => {
    return template.replace(/\{\s*(\w+)\s*\}/g, (match, key) => {
      return params[key] ?? match;
    });
  };
}
