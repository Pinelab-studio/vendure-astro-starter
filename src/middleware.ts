import { defineMiddleware, sequence } from "astro:middleware";
import { createMessageFn } from "./lib/locale-util";
import { locales } from "./locales";

const DEFAULT_LOCALE = "nl";

const i18nMiddleware = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  // Skip locale detection (and most of all redirection and 404 handling) for specific routes
  if (pathname.startsWith("/_image")) {
    return next();
  }

  let locale = pathname.split("/")?.[1];
  if (!locales.hasOwnProperty(locale)) {
    // We assume that the first part of the path is the NOT a locale,
    // so we rewrite to the default locale and append current path
    locale = DEFAULT_LOCALE;
    const newUrl = new URL(context.url);
    newUrl.search = context.url.search;
    newUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return context.redirect(newUrl.href);
  }
  context.locals.locale = locale;
  context.locals.m = createMessageFn(locales[locale as keyof typeof locales]);
  return next();
});

export const onRequest = sequence(i18nMiddleware);
