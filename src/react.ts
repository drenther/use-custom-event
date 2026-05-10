import { useEffect } from "react";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createEventEmitter as createCoreEventEmitter } from "./index";

export type { StandardSchemaV1 } from "@standard-schema/spec";

export function createEventEmitter<T extends StandardSchemaV1>(eventName: string, schema: T) {
  const core = createCoreEventEmitter(eventName, schema);

  type EventOutput = StandardSchemaV1.InferOutput<T>;
  type EventCallback = (data: EventOutput) => void | Promise<void>;

  return {
    ...core,
    useEventListener(callback: EventCallback) {
      useEffect(() => {
        return core.subscribe(callback);
      }, [callback]);
    },
  } as const;
}
