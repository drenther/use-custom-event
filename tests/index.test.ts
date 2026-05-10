import { describe, it, expect, vi } from "vitest";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createEventEmitter } from "../src/index";

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

describe("createEventEmitter", () => {
  it("should emit and subscribe to events", () => {
    const schema = createMockSchema<string>();
    const emitter = createEventEmitter("test-event", schema);
    const callback = vi.fn();

    emitter.subscribe(callback);
    emitter.emit("hello");

    expect(callback).toHaveBeenCalledWith("hello");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should support multiple subscribers", () => {
    const schema = createMockSchema<string>();
    const emitter = createEventEmitter("test-multi", schema);
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
    const emitter = createEventEmitter("test-unsub", schema);
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
    const emitter = createEventEmitter("test-validate", schema);
    const callback = vi.fn();

    emitter.subscribe(callback);
    emitter.emit({ name: "test" });

    expect(callback).toHaveBeenCalledWith({ name: "test" });
  });

  it("should throw on validation failure", () => {
    const schema = createMockObjectSchema();
    const emitter = createEventEmitter("test-fail", schema);

    expect(() => {
      emitter.emit({ name: 123 as unknown as string });
    }).toThrow("Expected object with string name property");
  });

  it("should throw TypeError for async schemas", () => {
    const schema = createAsyncMockSchema();
    const emitter = createEventEmitter("test-async", schema);

    expect(() => {
      emitter.emit("test");
    }).toThrow(TypeError);
    expect(() => {
      emitter.emit("test");
    }).toThrow("Schema validation must be synchronous");
  });

  it("should emit complex objects", () => {
    const schema = createMockSchema<{ count: number; items: string[] }>();
    const emitter = createEventEmitter("test-complex", schema);
    const callback = vi.fn();
    const payload = { count: 2, items: ["a", "b"] };

    emitter.subscribe(callback);
    emitter.emit(payload);

    expect(callback).toHaveBeenCalledWith(payload);
  });
});
