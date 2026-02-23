// src/components/WallpaperBackground.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParallax } from "./useParallax";

import bg1 from "../assets/wallpapers/bg1.png";
import bg2 from "../assets/wallpapers/bg2.png";
import bg3 from "../assets/wallpapers/bg3.png";
import bg4 from "../assets/wallpapers/bg4.png";
import bg5 from "../assets/wallpapers/bg5.png";
import bg6 from "../assets/wallpapers/bg6.png";
import bg7 from "../assets/wallpapers/bg7.png";

export default function WallpaperBackground() {

  // Hook that updates CSS variables (--mx / --my)
  // based on cursor movement for subtle depth effect.
  // This keeps parallax logic separate from visual rendering.
  useParallax(); 
  
  // Memoize image list so it doesn't recreate the array
  // on every render (not strictly required here, but clean).
  const images = useMemo(() => [bg1, bg2, bg3, bg4, bg5, bg6, bg7], []);

  // Index of current background image.
  const [i, setI] = useState(0);


  useEffect(() => {
    // Rotate wallpaper every 12 seconds.
    // Long enough to feel cinematic, not distracting.
    const t = setInterval(() => setI((x) => (x + 1) % images.length), 12000);
    return () => clearInterval(t);
  }, [images.length]);

  // Always clear interval on unmount to avoid memory leaks.
  return (
    <>
      {/* Main wallpaper layer.
         Uses CSS background-image so we can apply filters,
         blur, transforms, and parallax via CSS variables. */}
      <div className="bgWallpaper" style={{ backgroundImage: `url(${images[i]})` }} />

      {/* Dark overlay for contrast so UI text stays readable.
         Critical for accessibility. */}
      <div className="bgOverlay" />

      {/* Decorative animated lines (anime energy effect).
         Pure visual enhancement — no interaction. */}
      <div className="speedLines" />
    </>
  );
}