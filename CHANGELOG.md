## 3.0.0

### Major Changes

- f4eed6e: Decouple React hooks from core event emitters. The root entry point (`use-custom-event`) and broadcast entry point (`use-custom-event/broadcast`) no longer depend on React. Import from `use-custom-event/react` or `use-custom-event/broadcast/react` for React hook support.
- f2d070d: Replace zod with standard-schema support. Any validation library that implements the Standard Schema interface (zod 3.24+, valibot, arktype, etc.) can now be used instead of requiring zod specifically.

# 2.0.1

- Fix wrong `this` issue

# 2.0.0

- support for Broadcast Channel API

# 1.1.0

- fix types for nodenext resolution

# 1.0.0

- initial stable release

# 0.1.0

- Fix types and add keywords to package.json

# 0.0.0

- pre-release
