import { useEffect } from "react";
import type { StandardSchemaV1 } from "@standard-schema/spec";

export type { StandardSchemaV1 } from "@standard-schema/spec";

export function createBroadcastChannelEventEmitter<T extends StandardSchemaV1>(
  channel: BroadcastChannel,
  schema: T,
) {
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
    const handleEvent = (event: MessageEvent<EventOutput>) => {
      callback(event.data);
    };

    channel.addEventListener("message", handleEvent, false);

    return () => {
      channel.removeEventListener("message", handleEvent, false);
    };
  }

  return {
    emit(data: EventInput) {
      channel.postMessage(validate(data));
    },
    subscribe,
    useEventListener(callback: EventCallback) {
      useEffect(() => {
        return subscribe(callback);
      }, [callback]);
    },
  } as const;
}
