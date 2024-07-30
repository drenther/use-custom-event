import { useEffect } from 'react';
import { z } from 'zod';

export function createEventEmitter<T extends z.ZodTypeAny>(
  eventName: string,
  schema: T
) {
  const element = document.createElement('div');

  type EventDetail = z.infer<T>;
  type EventCallback = (data: EventDetail) => void | Promise<void>;

  return {
    emit(detail: EventDetail) {
      const event = new CustomEvent(eventName, {
        detail: schema.parse(detail),
        bubbles: true,
      });
      element.dispatchEvent(event);
    },
    subscribe(callback: EventCallback) {
      const handleEvent = (event: Event) => {
        callback((event as CustomEvent).detail);
      };

      element.addEventListener(eventName, handleEvent, false);

      return () => {
        element.removeEventListener(eventName, handleEvent, false);
      };
    },
    useEventListener(callback: EventCallback) {
      useEffect(() => {
        return this.subscribe(callback);
      }, [callback]);
    },
  } as const;
}
