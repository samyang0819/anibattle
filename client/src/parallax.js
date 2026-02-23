export function initParallax() {
  const root = document.documentElement;

  const onMove = (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;

    // small movement only
    root.style.setProperty("--mx", `${x * -16}px`);
    root.style.setProperty("--my", `${y * -12}px`);
  };

  window.addEventListener("mousemove", onMove, { passive: true });

  return () => window.removeEventListener("mousemove", onMove);
}