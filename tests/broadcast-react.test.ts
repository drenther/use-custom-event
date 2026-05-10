import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createBroadcastChannelEventEmitter } from "../src/broadcast-react";

function createMockSchema<T>(): StandardSchemaV1<T, T> {
  return {
    "~standard": {
      version: 1,
      vendor: "test",
      validate(value) {
        return { value: value as T };
      },
    },
  };
}

function createMockBroadcastChannel() {
  const listeners: Map<string, Set<(event: MessageEvent) => void>> = new Map();

  return {
    postMessage: vi.fn((data: unknown) => {
      const messageListeners = listeners.get("message");
      if (messageListeners) {
        const event = new MessageEvent("message", { data });
        for (const listener of messageListeners) {
          listener(event);
        }
      }
    }),
    addEventListener: vi.fn((type: string, listener: (event: MessageEvent) => void) => {
      if (!listeners.has(type)) {
        listeners.set(type, new Set());
      }
      listeners.get(type)!.add(listener);
    }),
    removeEventListener: vi.fn((type: string, listener: (event: MessageEvent) => void) => {
      listeners.get(type)?.delete(listener);
    }),
    close: vi.fn(),
    name: "test-channel",
    onmessage: null,
    onmessageerror: null,
    dispatchEvent: vi.fn(),
  } as unknown as BroadcastChannel;
}

describe("createBroadcastChannelEventEmitter (react)", () => {
  let channel: BroadcastChannel;

  beforeEach(() => {
    channel = createMockBroadcastChannel();
  });

  it("should work with useEventListener hook", () => {
    const schema = createMockSchema<string>();
    const emitter = createBroadcastChannelEventEmitter(channel, schema);
    const callback = vi.fn();

    renderHook(() => emitter.useEventListener(callback));
    emitter.emit("hook-data");

    expect(callback).toHaveBeenCalledWith("hook-data");
  });

  it("should clean up useEventListener on unmount", () => {
    const schema = createMockSchema<string>();
    const emitter = createBroadcastChannelEventEmitter(channel, schema);
    const callback = vi.fn();

    const { unmount } = renderHook(() => emitter.useEventListener(callback));
    emitter.emit("before");
    unmount();
    emitter.emit("after");

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("before");
  });

  it("should expose emit and subscribe from core", () => {
    const schema = createMockSchema<string>();
    const emitter = createBroadcastChannelEventEmitter(channel, schema);
    const callback = vi.fn();

    emitter.subscribe(callback);
    emitter.emit("passthrough");

    expect(channel.postMessage).toHaveBeenCalledWith("passthrough");
    expect(callback).toHaveBeenCalledWith("passthrough");
  });
});
