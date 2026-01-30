declare namespace App {
  interface Locals {
    locale: string;
    /// Type inference from the locales.ts file
    m: import("./lib/locale-util").LocaleMessageFunctions<
      typeof import("./locales").locales[keyof typeof import("./locales").locales]
    >;
  }
}
