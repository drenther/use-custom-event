import { useEffect } from 'react';
import { z } from 'zod';

export function createBroadcastChannelEventEmitter<T extends z.ZodTypeAny>(
  channel: BroadcastChannel,
  schema: T
) {
  type EventData = z.infer<T>;
  type EventCallback = (data: EventData) => void | Promise<void>;

  function subscribe(callback: EventCallback) {
    const handleEvent = (event: MessageEvent<EventData>) => {
      callback(event.data);
    };

    channel.addEventListener('message', handleEvent, false);

    return () => {
      channel.removeEventListener('message', handleEvent, false);
    };
  }

  return {
    emit(data: EventData) {
      channel.postMessage(schema.parse(data));
    },
    subscribe,
    useEventListener(callback: EventCallback) {
      useEffect(() => {
        return subscribe(callback);
      }, [callback]);
    },
  } as const;
}
