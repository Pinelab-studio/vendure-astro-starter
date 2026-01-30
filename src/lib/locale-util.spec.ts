import { it, expect } from "vitest";
import { createMessageFn } from "./locale-util";

it("should handle placeholders in template strings", () => {
  const messages = {
      welcome: "Hello {username}",
  };
  const m = createMessageFn(messages);
  expect(m.welcome({ username: "Martijn" })).toBe("Hello Martijn");
});

it("should handle spaces in placeholders", () => {
  const locales = {
    en: {
      welcome: "Hello { username }",
    },
  };
  const m = createMessageFn(locales.en);
  expect(m.welcome({ username: "Martijn" })).toBe("Hello Martijn");
});

it("should handle multiple placeholders in a single template", () => {
  const locales = {
    en: {
      welcome: "Hello {firstName} {lastName}",
    },
  };
  const m = createMessageFn(locales.en);
  expect(m.welcome({ firstName: "John", lastName: "Doe" })).toBe(
    "Hello John Doe",
  );
});

it("should leave unmatched placeholders unchanged", () => {
  const messages = {
    welcome: "Hello {username}",
  };
  const m = createMessageFn(messages);
  expect(m.welcome({})).toBe("Hello {username}");
});

it("should handle templates without placeholders", () => {
  const messages = {
    welcome: "Hello World",
  };
  const m = createMessageFn(messages);
  expect(m.welcome({})).toBe("Hello World");
});
