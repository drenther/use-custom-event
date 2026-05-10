import { useEffect } from "react";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createBroadcastChannelEventEmitter as createCoreBroadcastEmitter } from "./broadcast";

export type { StandardSchemaV1 } from "@standard-schema/spec";

export function createBroadcastChannelEventEmitter<T extends StandardSchemaV1>(
  channel: BroadcastChannel,
  schema: T,
) {
  const core = createCoreBroadcastEmitter(channel, schema);

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
