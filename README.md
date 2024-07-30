# use-custom-event

![Bundle Size](https://img.shields.io/bundlephobia/minzip/use-custom-event) ![npm version](https://badgen.net/npm/v/use-custom-event) ![types](https://badgen.net/npm/types/use-custom-event) ![visitor badge](https://visitor-badge.glitch.me/badge?page_id=use-custom-event)

A simple utility to create custom event emitter, listener (subscriber) and React hook for listening. Make the event payload strictly typed using [zod](https://github.com/colinhacks/zod)

## Installation

```shell
npm install use-custom-event
```

## Usage

### Basic Custom Event Emitter

```tsx
import { z } from 'zod';
import { createEventEmitter } from 'use-custom-event';

const { emit, subscribe, useEventListener } = createEventEmitter(
  'my-event',
  z.object({
    name: z.string(),
  })
);

// subscribing to the event - payload is strictly typed
// can be done from anywhere in the app (not react specific)
const unsubscribe = subscribe((data) => {
  console.log(data.name);
});
// call unsubscribe to stop listening to the event
unsubscribe();

function App() {
  // using the useEventListener hook
  useEventListener(
    // callback to handle the event - payload is strictly typed
    useCallback((data) => {
      console.log(data.name);
    }, [])
  );

  return (
    <button
      onClick={() => {
        // emitting the event (with payload) - payload is strictly typed
        // can be done from anywhere in the app (not react specific)
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

### Broadcast Channel Event Emitter

[Broadcast Channel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) is a simple API for communication between browsing contexts in the same origin. It is useful for sending messages between different tabs or windows of the same origin.

```tsx
import { z } from 'zod';
import { createBroadcastChannelEventEmitter } from 'use-custom-event';

const channel = new BroadcastChannel('my-channel');
const { emit, subscribe, useEventListener } =
  createBroadcastChannelEventEmitter(
    channel,
    z.object({
      name: z.string(),
    })
  );

// subscribing to the event - payload is strictly typed
// can be done from anywhere in the app (not react specific)
const unsubscribe = subscribe((data) => {
  console.log(data.name);
});
// call unsubscribe to stop listening to the event
unsubscribe();

function App() {
  // using the useEventListener hook
  useEventListener(
    // callback to handle the event - payload is strictly typed
    useCallback((data) => {
      console.log(data.name);
    }, [])
  );

  return (
    <button
      onClick={() => {
        // emitting the event (with payload) - payload is strictly typed
        // can be done from anywhere in the app (not react specific)
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
