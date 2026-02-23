import { useEffect, useRef, useState } from "react";
import track from "../assets/naruto-theme.mp3";

export default function AutoMusic() {
  // We keep a direct reference to the <audio> element
  // so we can control play(), mute, volume, etc.
  const audioRef = useRef(null);

  // Tracks whether music has successfully started.
  // Used to hide the "Click to start music" hint.
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Always loop the track — we want continuous background music
    audio.loop = true;

    // Preload helps reduce delay when play() is triggered
    audio.preload = "auto";

    // Browsers block autoplay with sound.
    // So we start muted to increase chance of autoplay success.
    audio.muted = true;

    // Set a comfortable volume level for when it unmutes later
    audio.volume = 0.35;

    // Try autoplay immediately (may fail silently)
    audio.play()
      .then(() => {
      // If this succeeds, music is technically playing (muted)
      setStarted(true);
    }).catch(() => {
      // Most browsers will block this.
      // That’s fine — we’ll unlock on first interaction.
    });

    // This function runs once user interacts (click / key press).
    // That interaction satisfies browser autoplay policies.
    const unlock = () => {
      if (!audioRef.current) return;

      // Attempt play again (in case autoplay failed earlier)
      audioRef.current.play().catch(() => {});

      // Now safely unmute — user has interacted
      audioRef.current.muted = false;

      setStarted(true);

      // We only need to unlock once, so remove listeners
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };

    // Listen for first user interaction.
    // "once: true" ensures this runs only one time.
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    // Cleanup in case component unmounts
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <>
      {/* Hidden audio element that actually plays the music */}
      <audio ref={audioRef} src={track} loop />
      
      {/* Small UX hint so users aren’t confused
         if autoplay is blocked and nothing plays yet */}
      {!started && (
        <div style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 999,
          padding: "10px 12px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,.14)",
          background: "rgba(15,18,35,.55)",
          backdropFilter: "blur(12px)",
          color: "rgba(234,240,255,.85)",
          fontWeight: 700,
          fontSize: 13
        }}>
          Click anywhere to start music 🎵
        </div>
      )}
    </>
  );
}
