import { useEffect } from 'react';
import { z } from 'zod';

let targetElement: undefined | HTMLDivElement;
function getElement() {
  if (targetElement) {
    return targetElement;
  }

  return (targetElement = document.createElement('div'));
}

export function createEventEmitter<T extends z.ZodTypeAny>(
  eventName: 'string',
  schema: T
) {
  const element = getElement();

  type EventDetail = z.infer<T>;
  type EventCallback = (data: EventDetail) => void | Promise<void>;

  return {
    emit: (detail: EventDetail) => {
      const event = new CustomEvent(eventName, {
        detail: schema.parse(detail),
        bubbles: true,
      });
      element.dispatchEvent(event);
    },
    subscribe: (callback: EventCallback) => {
      element.addEventListener(eventName, (event) => {
        callback((event as CustomEvent).detail);
      });
    },
    useCustomEvent: (callback: EventCallback) => {
      useEffect(() => {
        const handleEvent = (event: Event) => {
          callback((event as CustomEvent).detail);
        };
        element.addEventListener(eventName, handleEvent, false);
        return () => {
          element.removeEventListener(eventName, handleEvent, false);
        };
      }, [callback]);
    },
  } as const;
}
