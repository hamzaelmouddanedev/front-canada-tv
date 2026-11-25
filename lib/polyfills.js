// Replaces Next's built-in `polyfill-module` (see `turbopack.resolveAlias` in next.config.ts).
// Next 16 targets Chrome/Edge/Firefox 111+ and Safari 16.4+, which ship everything that
// module polyfills (Array#at/flat/flatMap, Object.hasOwn/fromEntries, String#trimStart/End,
// Symbol#description, Promise#finally) — Lighthouse flags it as "Legacy JavaScript".
// Only URL.canParse (Safari 17+, Chrome 120+) is still needed for that browser range.
if (typeof URL !== "undefined" && !("canParse" in URL)) {
  URL.canParse = function (url, base) {
    try {
      return !!new URL(url, base);
    } catch {
      return false;
    }
  };
}
