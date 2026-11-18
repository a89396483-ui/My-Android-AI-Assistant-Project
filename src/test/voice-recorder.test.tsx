import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VoiceRecorder } from "@/components/VoiceRecorder";

const trackStop = vi.fn();
const stream = { getTracks: () => [{ stop: trackStop }] };
const getUserMedia = vi.fn();
class FakeRecorder {
  static latest: FakeRecorder | undefined;
  state = "inactive";
  mimeType = "audio/webm";
  onstop: (() => void) | null = null;
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  constructor() { FakeRecorder.latest = this; }
  start() { this.state = "recording"; }
  stop = vi.fn(() => {
    this.state = "inactive";
    this.ondataavailable?.({ data: new Blob(["recorded audio"]) });
    this.onstop?.();
  });
}

beforeEach(() => {
  FakeRecorder.latest = undefined;
  trackStop.mockClear();
  getUserMedia.mockReset().mockResolvedValue(stream);
  vi.stubGlobal("MediaRecorder", FakeRecorder);
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:recording") });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("Recording privacy and cleanup", () => {
  it("stops active recording and releases the microphone when leaving the page", async () => {
    const view = render(<VoiceRecorder />);
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }));
    await screen.findByRole("button", { name: "Stop recording" });
    view.unmount();
    expect(FakeRecorder.latest?.stop).toHaveBeenCalledTimes(1);
    expect(trackStop).toHaveBeenCalledTimes(1);
    expect(FakeRecorder.latest?.onstop).toBeNull();
  });

  it("releases a microphone permission result that arrives after leaving", async () => {
    let grant: ((value: typeof stream) => void) | undefined;
    getUserMedia.mockImplementation(() => new Promise((resolve) => { grant = resolve; }));
    const view = render(<VoiceRecorder />);
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }));
    view.unmount();
    await act(async () => { grant?.(stream); });
    expect(trackStop).toHaveBeenCalledTimes(1);
    expect(FakeRecorder.latest).toBeUndefined();
  });

  it("stops the microphone on browser page exit", async () => {
    render(<VoiceRecorder />);
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }));
    await screen.findByRole("button", { name: "Stop recording" });
    fireEvent(window, new Event("pagehide"));
    expect(FakeRecorder.latest?.stop).toHaveBeenCalledTimes(1);
    expect(trackStop).toHaveBeenCalledTimes(1);
  });

  it("keeps manual-stop playback available and releases its download on unmount", async () => {
    const view = render(<VoiceRecorder />);
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }));
    fireEvent.click(await screen.findByRole("button", { name: "Stop recording" }));
    await waitFor(() => expect(screen.getByRole("link", { name: "Download recording" })).toHaveAttribute("href", "blob:recording"));
    expect(trackStop).toHaveBeenCalled();
    view.unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:recording");
  });
});
