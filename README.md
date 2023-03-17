# use-custom-event

![Bundle Size](https://badgen.net/bundlephobia/minzip/use-custom-event) ![npm version](https://badgen.net/npm/v/use-custom-event) ![types](https://badgen.net/npm/types/use-custom-event)

A simple utility to create custom event emitter, listener (subscriber) and React hook for listening. Make the event payload strictly typed using [zod](https://github.com/colinhacks/zod)

## Installation

```shell
npm install use-custom-event
```

## Usage

```tsx
import { z } from 'zod';
import { createEventEmitter } from 'use-custom-event';

const { emit, useEventListener } = createEventEmitter(
  'my-event',
  z.object({
    name: z.string(),
  })
);

function App() {
  useEventListener(
    useCallback((data) => {
      console.log(data.name);
    }, [])
  );

  return (
    <button
      onClick={() => {
        emit({
          name: 'drenther',
        });
      }}
    >
      Trigger Event
    </button>
  );
}
```

Use it for whatever you like and drop us a star!
