import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Wallpapers used as gallery cards.
// If you add more images, just import them and push into the cards array.
import c1 from "../assets/wallpapers/bg1.png";
import c2 from "../assets/wallpapers/bg2.png";
import c3 from "../assets/wallpapers/bg3.png";
import c4 from "../assets/wallpapers/bg4.png";
import c5 from "../assets/wallpapers/bg5.png";
import c6 from "../assets/wallpapers/bg6.png";
import c7 from "../assets/wallpapers/bg7.png";

export default function Gallery() {

  // Static card data.
  // useMemo prevents recreating this array every render.
  const cards = useMemo(() => ([
    { id: 1, title: "Naruto Vibe", tag: "Shonen", img: c1, desc: "Energy, speed lines, ranked grind." },
    { id: 2, title: "Neon City Arc", tag: "Cyber", img: c2, desc: "Late-night battles, leaderboard climbs." },
    { id: 3, title: "Studio Sky", tag: "Chill", img: c3, desc: "Solo training arc, calm focus." },
    { id: 4, title: "Mystic Forest", tag: "Fantasy", img: c4, desc: "Ancient magic, hidden paths." },
    { id: 5, title: "Desert Storm", tag: "Adventure", img: c5, desc: "Endless dunes, survival challenges." },
    { id: 6, title: "Ocean Depths", tag: "Mystery", img: c6, desc: "Deep sea secrets, underwater exploration." },
    { id: 7, title: "Mountain Peak", tag: "Epic", img: c7, desc: "Summit challenges, breathtaking views." },
  ]), []);

  // Stores the currently opened card (null = modal closed)
  const [open, setOpen] = useState(null);

  return (
    <div className="hero">
      <div className="card">
        <div className="cardHeader">
          <div className="h1">Anime Gallery</div>
          <div className="sub">
            Click a card to open the full wallpaper. Add more by expanding the array in <b>Gallery.jsx</b>.
          </div>
        </div>

        <div className="cardBody">

          {/* Responsive grid for wallpapers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14
          }}>
            {cards.map((c) => (
              <motion.button
                key={c.id}
                className="animeCard"

                // Open modal with this card’s data
                onClick={() => setOpen(c)}

                // Slight hover lift for polish
                whileHover={{ y: -3 }}

                // Subtle tap feedback
                whileTap={{ scale: 0.99 }}
              >
                {/* Background image layer */}
                <div className="animeCardImg" style={{ backgroundImage: `url(${c.img})` }} />
                
                {/* Text section */}
                <div className="animeCardBody">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 950 }}>{c.title}</div>
                    <span className="rankPill tierB">{c.tag}</span>
                  </div>
                  <div className="sub" style={{ marginTop: 6 }}>{c.desc}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Modal for enlarged wallpaper */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="modalBackdrop"

            // Fade in/out backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

            // Clicking outside closes modal
            onClick={() => setOpen(null)}
          >
            <motion.div
              className="modalCard"

              // Slight pop-in animation
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}

              // Prevent backdrop click from closing when clicking inside card
              onClick={(e) => e.stopPropagation()}
            >
              {/* Full wallpaper preview */}
              <div className="modalImg" style={{ backgroundImage: `url(${open.img})` }} />
              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div style={{ fontWeight: 950, fontSize: 18 }}>{open.title}</div>
                  <button className="pill" onClick={() => setOpen(null)}>Close</button>
                </div>
                <div className="sub" style={{ marginTop: 6 }}>{open.desc}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
