# use-custom-event

![Bundle Size](https://img.shields.io/bundlephobia/minzip/use-custom-event) ![npm version](https://badgen.net/npm/v/use-custom-event) ![types](https://badgen.net/npm/types/use-custom-event)

Typed custom event emitters for React with runtime validation via [Standard Schema](https://github.com/standard-schema/standard-schema). Works with any compatible validation library — no adapter needed.

## Compatible Validation Libraries

| Library                                              | Minimum Version |
| ---------------------------------------------------- | --------------- |
| [Zod](https://github.com/colinhacks/zod)             | 3.24.0          |
| [Valibot](https://github.com/fabian-hiller/valibot)  | 1.0.0           |
| [ArkType](https://github.com/arktypeio/arktype)      | 2.0.0           |
| [Effect Schema](https://github.com/Effect-TS/effect) | 3.13.0          |
| [Yup](https://github.com/jquense/yup)                | 1.7.0           |
| [Joi](https://github.com/hapijs/joi)                 | 18.0.0          |
| [Typia](https://github.com/samchon/typia)            | 9.2.0           |
| [VineJS](https://github.com/vinejs/vine)             | 4.0.0           |

Any library that implements the [Standard Schema](https://github.com/standard-schema/standard-schema#what-schema-libraries-implement-the-spec) spec works out of the box.

## Installation

```shell
pnpm add use-custom-event
```

## Usage with Zod

```tsx
import { z } from "zod";
import { createEventEmitter } from "use-custom-event";

const { emit, subscribe, useEventListener } = createEventEmitter(
  "my-event",
  z.object({ name: z.string() }),
);

const unsubscribe = subscribe((data) => {
  console.log(data.name); // strictly typed
});
unsubscribe();

function App() {
  useEventListener(
    useCallback((data) => {
      console.log(data.name);
    }, []),
  );

  return <button onClick={() => emit({ name: "hello" })}>Trigger</button>;
}
```

## Usage with Valibot

```tsx
import * as v from "valibot";
import { createEventEmitter } from "use-custom-event";

const { emit, subscribe, useEventListener } = createEventEmitter(
  "my-event",
  v.object({ name: v.string() }),
);

const unsubscribe = subscribe((data) => {
  console.log(data.name);
});
unsubscribe();

function App() {
  useEventListener(
    useCallback((data) => {
      console.log(data.name);
    }, []),
  );

  return <button onClick={() => emit({ name: "hello" })}>Trigger</button>;
}
```

## Usage with ArkType

```tsx
import { type } from "arktype";
import { createEventEmitter } from "use-custom-event";

const { emit, subscribe, useEventListener } = createEventEmitter(
  "my-event",
  type({ name: "string" }),
);

const unsubscribe = subscribe((data) => {
  console.log(data.name);
});
unsubscribe();

function App() {
  useEventListener(
    useCallback((data) => {
      console.log(data.name);
    }, []),
  );

  return <button onClick={() => emit({ name: "hello" })}>Trigger</button>;
}
```

## Usage with Effect Schema

```tsx
import { Schema } from "effect";
import { createEventEmitter } from "use-custom-event";

const { emit, subscribe, useEventListener } = createEventEmitter(
  "my-event",
  Schema.Struct({ name: Schema.String }),
);

const unsubscribe = subscribe((data) => {
  console.log(data.name);
});
unsubscribe();

function App() {
  useEventListener(
    useCallback((data) => {
      console.log(data.name);
    }, []),
  );

  return <button onClick={() => emit({ name: "hello" })}>Trigger</button>;
}
```

## Usage with Yup

```tsx
import * as yup from "yup";
import { createEventEmitter } from "use-custom-event";

const { emit, subscribe, useEventListener } = createEventEmitter(
  "my-event",
  yup.object({ name: yup.string().required() }),
);

const unsubscribe = subscribe((data) => {
  console.log(data.name);
});
unsubscribe();

function App() {
  useEventListener(
    useCallback((data) => {
      console.log(data.name);
    }, []),
  );

  return <button onClick={() => emit({ name: "hello" })}>Trigger</button>;
}
```

## Broadcast Channel

[Broadcast Channel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) enables communication between tabs/windows of the same origin. Works with any compatible validation library.

```tsx
import { z } from "zod";
import { createBroadcastChannelEventEmitter } from "use-custom-event/broadcast";

const channel = new BroadcastChannel("my-channel");
const { emit, subscribe, useEventListener } = createBroadcastChannelEventEmitter(
  channel,
  z.object({ name: z.string() }),
);

const unsubscribe = subscribe((data) => {
  console.log(data.name);
});
unsubscribe();

function App() {
  useEventListener(
    useCallback((data) => {
      console.log(data.name);
    }, []),
  );

  return <button onClick={() => emit({ name: "hello" })}>Trigger</button>;
}
```

## Migrating from v2

v3 replaces the `zod` peer dependency with [Standard Schema](https://github.com/standard-schema/standard-schema) support. Your existing zod schemas work unchanged if you upgrade zod to 3.24.0+. You can also switch to any other compatible library.

```diff
- import { z } from "zod"; // zod < 3.24
+ import { z } from "zod"; // zod >= 3.24 (no code changes needed)
```

Or switch validation libraries entirely:

```diff
- import { z } from "zod";
+ import * as v from "valibot";

  const emitter = createEventEmitter(
    "my-event",
-   z.object({ name: z.string() }),
+   v.object({ name: v.string() }),
  );
```

## License

MIT
