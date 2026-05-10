import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createEventEmitter } from "../src/react";

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

describe("createEventEmitter (react)", () => {
  it("should work with useEventListener hook", () => {
    const schema = createMockSchema<string>();
    const emitter = createEventEmitter("test-hook", schema);
    const callback = vi.fn();

    renderHook(() => emitter.useEventListener(callback));
    emitter.emit("hook-data");

    expect(callback).toHaveBeenCalledWith("hook-data");
  });

  it("should clean up useEventListener on unmount", () => {
    const schema = createMockSchema<string>();
    const emitter = createEventEmitter("test-cleanup", schema);
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
    const emitter = createEventEmitter("test-passthrough", schema);
    const callback = vi.fn();

    emitter.subscribe(callback);
    emitter.emit("passthrough");

    expect(callback).toHaveBeenCalledWith("passthrough");
  });
});
