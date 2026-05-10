# use-custom-event

![Bundle Size](https://img.shields.io/bundlephobia/minzip/use-custom-event) ![npm version](https://badgen.net/npm/v/use-custom-event) ![types](https://badgen.net/npm/types/use-custom-event)

Typed custom event emitters with runtime validation via [Standard Schema](https://github.com/standard-schema/standard-schema). Framework-agnostic core with optional React bindings. Works with any compatible validation library — no adapter needed.

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

## Entry Points

| Import Path                        | Description                          | Requires React |
| ---------------------------------- | ------------------------------------ | -------------- |
| `use-custom-event`                 | Core event emitter (DOM CustomEvent) | No             |
| `use-custom-event/react`           | Core + `useEventListener` hook       | Yes            |
| `use-custom-event/broadcast`       | BroadcastChannel event emitter       | No             |
| `use-custom-event/broadcast/react` | Broadcast + `useEventListener` hook  | Yes            |

## Usage with Zod

### Core (no React dependency)

```ts
import { z } from "zod";
import { createEventEmitter } from "use-custom-event";

const { emit, subscribe } = createEventEmitter("my-event", z.object({ name: z.string() }));

const unsubscribe = subscribe((data) => {
  console.log(data.name); // strictly typed
});
unsubscribe();
```

### With React

```tsx
import { z } from "zod";
import { createEventEmitter } from "use-custom-event/react";

const { emit, subscribe, useEventListener } = createEventEmitter(
  "my-event",
  z.object({ name: z.string() }),
);

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

```ts
import * as v from "valibot";
import { createEventEmitter } from "use-custom-event";

const { emit, subscribe } = createEventEmitter("my-event", v.object({ name: v.string() }));
```

## Usage with ArkType

```ts
import { type } from "arktype";
import { createEventEmitter } from "use-custom-event";

const { emit, subscribe } = createEventEmitter("my-event", type({ name: "string" }));
```

## Usage with Effect Schema

```ts
import { Schema } from "effect";
import { createEventEmitter } from "use-custom-event";

const { emit, subscribe } = createEventEmitter("my-event", Schema.Struct({ name: Schema.String }));
```

## Usage with Yup

```ts
import * as yup from "yup";
import { createEventEmitter } from "use-custom-event";

const { emit, subscribe } = createEventEmitter(
  "my-event",
  yup.object({ name: yup.string().required() }),
);
```

## Broadcast Channel

[Broadcast Channel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) enables communication between tabs/windows of the same origin. Works with any compatible validation library.

### Core (no React dependency)

```ts
import { z } from "zod";
import { createBroadcastChannelEventEmitter } from "use-custom-event/broadcast";

const channel = new BroadcastChannel("my-channel");
const { emit, subscribe } = createBroadcastChannelEventEmitter(
  channel,
  z.object({ name: z.string() }),
);

const unsubscribe = subscribe((data) => {
  console.log(data.name);
});
unsubscribe();
```

### With React

```tsx
import { z } from "zod";
import { createBroadcastChannelEventEmitter } from "use-custom-event/broadcast/react";

const channel = new BroadcastChannel("my-channel");
const { emit, useEventListener } = createBroadcastChannelEventEmitter(
  channel,
  z.object({ name: z.string() }),
);

function App() {
  useEventListener(
    useCallback((data) => {
      console.log(data.name);
    }, []),
  );

  return <button onClick={() => emit({ name: "hello" })}>Trigger</button>;
}
```

## Migrating from v3

v4 decouples React bindings from the core modules. The root entry point (`use-custom-event`) and broadcast entry point (`use-custom-event/broadcast`) no longer depend on React or export `useEventListener`. Import from the `/react` subpath instead:

```diff
- import { createEventEmitter } from "use-custom-event";
+ import { createEventEmitter } from "use-custom-event/react";
```

```diff
- import { createBroadcastChannelEventEmitter } from "use-custom-event/broadcast";
+ import { createBroadcastChannelEventEmitter } from "use-custom-event/broadcast/react";
```

If you only use `emit` and `subscribe` (no hooks), your imports stay the same — no changes needed.

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
