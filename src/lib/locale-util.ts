import messagesJson from "../messages.json";

// This util is responsible for loading locale messages and replacing placeholders in template strings.

/**
 * The type of the locale messages, inferred from messages.json.
 */
export type LocaleMessages = (typeof messagesJson)[keyof typeof messagesJson];
/**
 * The type of all message functions.
 * Example: `m.welcome()`, `m.hero()` etc.
 */
export type LocaleMessageFunctions = {
  [K in keyof LocaleMessages]: (params: Record<string, string>) => string;
};

/**
 * Load locale messages from the messages.json file.
 * Returns a map of locale to locale messages, e.g, { "en": { "welcome": "Hello" }, "nl": { "welcome": "Hallo" } }
 */
export function loadAllLocaleMessages(
  supportedLocales: string[],
): Record<string, LocaleMessages> {
  const messages: Record<string, LocaleMessages> = {};
  supportedLocales.forEach((locale) => {
    const localeMessages = messagesJson[locale as keyof typeof messagesJson];
    if (!localeMessages) {
      throw new Error(
        `No messages found for locale '${locale}' in messages.json`,
      );
    }
    messages[locale] = localeMessages;
  });
  return messages;
}

/**
 * Creates message functions for each key in messages.json.
 * Example: `m.welcome({ username: "Martijn" })` => `Hello Martijn`
 */
export function createMessageFn(
  localeMessages: LocaleMessages,
): LocaleMessageFunctions {
  const result: Record<string, (params: Record<string, string>) => string> = {};
  for (const key in localeMessages) {
    const template = localeMessages[key as keyof LocaleMessages] as string;
    result[key] = createTemplateFn(template);
  }
  return result as LocaleMessageFunctions;
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
