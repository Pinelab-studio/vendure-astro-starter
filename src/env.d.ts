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

