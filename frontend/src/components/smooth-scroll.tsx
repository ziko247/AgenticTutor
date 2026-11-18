"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;

    function update() {
      lenis?.destroy();
      lenis = undefined;
      if (!preference.matches) {
        lenis = new Lenis({
          autoRaf: true,
          anchors: true,
          allowNestedScroll: true,
          stopInertiaOnNavigate: true,
        });
      }
    }

    update();
    preference.addEventListener("change", update);
    return () => {
      preference.removeEventListener("change", update);
      lenis?.destroy();
    };
  }, []);

  return null;
}
