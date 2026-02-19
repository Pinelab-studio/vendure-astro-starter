
interface ImportMetaEnv {
  /**
   * Random secret to prevent unauthorized cache invalidation calls
   */
  CACHE_INVALIDATION_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type Messages = typeof import("./translations").Messages;

declare namespace App {
  interface Locals {
    locale: string;
    /// Type inference from the locales.ts file
    m: import("./lib/locale-util").LocaleMessageFunctions<
      Messages
    >;
  }
}

interface Window {
  __messages: Messages;
}

