import { useEffect, useRef } from "react";

// One owner for resources that must not outlive the current page.
export function useMediaLifecycle(release: () => void) {
  const active = useRef(false);
  const cleanup = useRef(release);
  cleanup.current = release;
  useEffect(() => {
    active.current = true;
    const leave = () => { active.current = false; cleanup.current(); };
    const resume = () => { active.current = true; };
    window.addEventListener("pagehide", leave);
    window.addEventListener("pageshow", resume);
    return () => {
      window.removeEventListener("pagehide", leave);
      window.removeEventListener("pageshow", resume);
      leave();
    };
  }, []);
  return active;
}
