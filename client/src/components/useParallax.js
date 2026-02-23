import { useEffect } from "react";

export function useParallax() {
  useEffect(() => {
    // We store the current animation frame ID
    // so we can cancel it if a new mouse event fires quickly.
    let raf = 0;

    function onMove(e) {
      // Normalize mouse position to range [-0.5, 0.5]
      // Center of screen = 0,0
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);

      // Keep offsets small so the effect feels subtle and polished.
      // Too much movement = cheap / dizzy.
      const mx = `${x * 18}px`;
      const my = `${y * 14}px`;
      
      // If the mouse is moving fast,
      // cancel the previous frame to avoid stacking updates.
      cancelAnimationFrame(raf);

      // Schedule the CSS update on the next animation frame.
      // This keeps it smooth and avoids layout thrashing.
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mx", mx);
        document.documentElement.style.setProperty("--my", my);
      });
    }

    // Passive listener improves scroll/mouse performance
    window.addEventListener("mousemove", onMove, { passive: true });

    // Clean up when component unmounts
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
}
