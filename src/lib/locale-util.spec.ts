import { it, expect } from "vitest";
import { createMessageFn, type LocaleMessages } from "./locale-util";

it("should handle placeholders in template strings", () => {
  const localeMessages: LocaleMessages = {
    welcome: "Hello {username}",
  };
  const m = createMessageFn(localeMessages);
  expect(m.welcome({ username: "Martijn" })).toBe("Hello Martijn");
});

it("should handle spaces in placeholders", () => {
  const localeMessages: LocaleMessages = {
    welcome: "Hello { username }",
  };
  const m = createMessageFn(localeMessages);
  expect(m.welcome({ username: "Martijn" })).toBe("Hello Martijn");
});

it("should handle multiple placeholders in a single template", () => {
  const localeMessages: LocaleMessages = {
    welcome: "Hello {firstName} {lastName}",
  };
  const m = createMessageFn(localeMessages);
  expect(m.welcome({ firstName: "John", lastName: "Doe" })).toBe(
    "Hello John Doe",
  );
});

it("should leave unmatched placeholders unchanged", () => {
  const localeMessages: LocaleMessages = {
    welcome: "Hello {username}",
  };
  const m = createMessageFn(localeMessages);
  expect(m.welcome({})).toBe("Hello {username}");
});

it("should handle templates without placeholders", () => {
  const localeMessages: LocaleMessages = {
    welcome: "Hello World",
  };
  const m = createMessageFn(localeMessages);
  expect(m.welcome({})).toBe("Hello World");
});
