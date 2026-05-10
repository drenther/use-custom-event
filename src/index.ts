import { useEffect } from "react";
import type { StandardSchemaV1 } from "@standard-schema/spec";

export type { StandardSchemaV1 } from "@standard-schema/spec";

export function createEventEmitter<T extends StandardSchemaV1>(eventName: string, schema: T) {
  const element = document.createElement("div");

  type EventInput = StandardSchemaV1.InferInput<T>;
  type EventOutput = StandardSchemaV1.InferOutput<T>;
  type EventCallback = (data: EventOutput) => void | Promise<void>;

  function validate(data: EventInput): EventOutput {
    const result = schema["~standard"].validate(data);
    if (result instanceof Promise) {
      throw new TypeError("Schema validation must be synchronous");
    }
    if (result.issues) {
      throw new Error(JSON.stringify(result.issues, null, 2));
    }
    return result.value;
  }

  function subscribe(callback: EventCallback) {
    const handleEvent = (event: Event) => {
      callback((event as CustomEvent).detail);
    };

    element.addEventListener(eventName, handleEvent, false);

    return () => {
      element.removeEventListener(eventName, handleEvent, false);
    };
  }

  return {
    emit(detail: EventInput) {
      const event = new CustomEvent(eventName, {
        detail: validate(detail),
        bubbles: true,
      });
      element.dispatchEvent(event);
    },
    subscribe,
    useEventListener(callback: EventCallback) {
      useEffect(() => {
        return subscribe(callback);
      }, [callback]);
    },
  } as const;
}
