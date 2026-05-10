import { describe, it, expect, vi, beforeEach } from "vitest";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createBroadcastChannelEventEmitter } from "../src/broadcast";

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

function createMockObjectSchema() {
  return {
    "~standard": {
      version: 1 as const,
      vendor: "test",
      validate(value: unknown) {
        if (
          typeof value === "object" &&
          value !== null &&
          "name" in value &&
          typeof (value as Record<string, unknown>).name === "string"
        ) {
          return { value: value as { name: string } };
        }
        return {
          issues: [{ message: "Expected object with string name property" }],
        };
      },
      types: undefined as unknown as {
        input: { name: string };
        output: { name: string };
      },
    },
  } satisfies StandardSchemaV1<{ name: string }, { name: string }>;
}

function createAsyncMockSchema(): StandardSchemaV1<string, string> {
  return {
    "~standard": {
      version: 1,
      vendor: "test-async",
      validate() {
        return Promise.resolve({ value: "async" });
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

describe("createBroadcastChannelEventEmitter", () => {
  let channel: BroadcastChannel;

  beforeEach(() => {
    channel = createMockBroadcastChannel();
  });

  it("should emit and subscribe to messages", () => {
    const schema = createMockSchema<string>();
    const emitter = createBroadcastChannelEventEmitter(channel, schema);
    const callback = vi.fn();

    emitter.subscribe(callback);
    emitter.emit("hello");

    expect(channel.postMessage).toHaveBeenCalledWith("hello");
    expect(callback).toHaveBeenCalledWith("hello");
  });

  it("should support multiple subscribers", () => {
    const schema = createMockSchema<string>();
    const emitter = createBroadcastChannelEventEmitter(channel, schema);
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    emitter.subscribe(callback1);
    emitter.subscribe(callback2);
    emitter.emit("data");

    expect(callback1).toHaveBeenCalledWith("data");
    expect(callback2).toHaveBeenCalledWith("data");
  });

  it("should unsubscribe correctly", () => {
    const schema = createMockSchema<string>();
    const emitter = createBroadcastChannelEventEmitter(channel, schema);
    const callback = vi.fn();

    const unsubscribe = emitter.subscribe(callback);
    emitter.emit("first");
    unsubscribe();
    emitter.emit("second");

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("first");
  });

  it("should validate data with standard schema on emit", () => {
    const schema = createMockObjectSchema();
    const emitter = createBroadcastChannelEventEmitter(channel, schema);
    const callback = vi.fn();

    emitter.subscribe(callback);
    emitter.emit({ name: "test" });

    expect(channel.postMessage).toHaveBeenCalledWith({ name: "test" });
    expect(callback).toHaveBeenCalledWith({ name: "test" });
  });

  it("should throw on validation failure", () => {
    const schema = createMockObjectSchema();
    const emitter = createBroadcastChannelEventEmitter(channel, schema);

    expect(() => {
      emitter.emit({ name: 123 as unknown as string });
    }).toThrow("Expected object with string name property");
  });

  it("should throw TypeError for async schemas", () => {
    const schema = createAsyncMockSchema();
    const emitter = createBroadcastChannelEventEmitter(channel, schema);

    expect(() => {
      emitter.emit("test");
    }).toThrow(TypeError);
    expect(() => {
      emitter.emit("test");
    }).toThrow("Schema validation must be synchronous");
  });
});
