import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useMediaLifecycle } from "@/hooks/use-media-lifecycle";

describe("Page media lifetime", () => {
  it("releases resources and invalidates pending permission work on unmount", () => {
    const release = vi.fn();
    const { result, unmount } = renderHook(() => useMediaLifecycle(release));
    expect(result.current.current).toBe(true);
    unmount();
    expect(result.current.current).toBe(false);
    expect(release).toHaveBeenCalledTimes(1);
  });
  it("releases resources on page exit and allows an explicit new action on return", () => {
    const release = vi.fn();
    const { result, unmount } = renderHook(() => useMediaLifecycle(release));
    act(() => window.dispatchEvent(new Event("pagehide")));
    expect(result.current.current).toBe(false);
    expect(release).toHaveBeenCalledTimes(1);
    act(() => window.dispatchEvent(new Event("pageshow")));
    expect(result.current.current).toBe(true);
    unmount();
  });
});
