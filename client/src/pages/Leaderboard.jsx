import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";

/**
 * Tiny tier system based purely on rank position.
 * Keeps the UI fun without forcing a complicated MMR system.
 */
function tierForRank(rank) {
  if (rank === 1) return { cls: "tierS", label: "S" };
  if (rank <= 3) return { cls: "tierA", label: "A" };
  if (rank <= 10) return { cls: "tierB", label: "B" };
  return { cls: "tierC", label: "C" };
}

export default function Leaderboard() {
  // "range" controls what leaderboard slice we ask the backend for.
  // Weekly keeps it fresh, All-time is the long-term flex.
  const [range, setRange] = useState("all"); // "weekly" | "all"

  // Normalized leaderboard rows from backend
  const [rows, setRows] = useState([]);

  // Basic UI state: errors + loading
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Pull out top 3 separately for the "podium" section.
  // Keeps the main table readable while still celebrating winners.
  const top = useMemo(() => rows.slice(0, 3), [rows]);

  useEffect(() => {
    // Inline async because useEffect can't be async directly.
    // We fetch whenever the range toggles.
    (async () => {
      setErr("");
      setLoading(true);
      try {
        // If your backend uses a different query param name,
        // this is the first place to change it.
        const data = await api(`/leaderboard?range=${range}`);

        // Backend responses vary during development,
        // so we defensively read a few common shapes
        setRows(data.leaderboard ?? data.rows ?? data ?? []);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [range]);

  return (
    <div className="hero">
      <div className="card">
        <div className="cardHeader">
          <div className="h1">Leaderboard</div>
          <div className="sub">Climb ranks, earn points, and flex your anime knowledge.</div>

          {/* Range toggle: simple UI, big impact */}
          <div className="chipRow">
            <button className="chip" onClick={() => setRange("weekly")}>
              Weekly
            </button>
            <button className="chip" onClick={() => setRange("all")}>
              All-time
            </button>
          </div>
        </div>

        <div className="cardBody">
          {err && <div className="notice noticeBad">{err}</div>}
          {loading && <div className="notice">Loading rankings…</div>}

          {/* Top 3 podium cards */}
          {top.length > 0 && (
            <div className="grid3" style={{ marginBottom: 14 }}>
              {top.map((u, i) => (
                <div key={u.id || u._id || i} className="kpiBig">
                  <div className="rankPill tierA" style={{ justifyContent: "space-between", width: "100%" }}>
                    <span>🏆 Top {i + 1}</span>
                    <span style={{ opacity: 0.85 }}>Tier {tierForRank(i + 1).label}</span>
                  </div>
                  <div className="num" style={{ marginTop: 10 }}>{u.username ?? u.name ?? "Player"}</div>
                  <div className="lbl">
                    Points: <b>{u.points ?? u.winPoints ?? u.rating ?? 0}</b> • Wins: <b>{u.wins ?? 0}</b>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main leaderboard table */}
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Rank</th>
                <th>Player</th>
                <th style={{ width: 130 }}>Tier</th>
                <th style={{ width: 140 }}>Points</th>
                <th style={{ width: 100 }}>Wins</th>
                <th style={{ width: 110 }}>Losses</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u, idx) => {
                const rank = idx + 1;
                const t = tierForRank(rank);
                return (
                  <motion.tr
                    key={u.id || u._id || rank}

                    // Tiny motion makes the table feel alive,
                    // without turning it into a distracting animation.
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: Math.min(idx * 0.02, 0.25) }}
                  >
                    <td><b>#{rank}</b></td>
                    <td style={{ fontWeight: 850 }}>{u.username ?? u.name ?? "Player"}</td>
                    <td>
                      <span className={`rankPill ${t.cls}`}>Tier {t.label}</span>
                    </td>
                    <td><b>{u.points ?? u.winPoints ?? u.rating ?? 0}</b></td>
                    <td>{u.wins ?? 0}</td>
                    <td>{u.losses ?? 0}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Empty state message (only after loading finishes) */}
          {!loading && rows.length === 0 && (
            <div className="notice" style={{ marginTop: 12 }}>
              No leaderboard data yet. Submit a solo quiz or complete a battle to populate it.
            </div>
          )}
        </div>
      </div>
        
      {/* Extra flavor / explanation card */}
      <div className="card">
        <div className="cardHeader">
          <div className="h1" style={{ fontSize: 26 }}>How to Rank Up</div>
          <div className="sub">
            Win battles for big jumps. Solo runs are your training arc.
          </div>
        </div>
        <div className="cardBody">
          <div className="kpiBig">
            <div className="num">S Tier</div>
            <div className="lbl">Top 1 — “Main Character Energy”</div>
          </div>
          <div className="divider" />
          <div className="kpiBig">
            <div className="num">A Tier</div>
            <div className="lbl">Top 2–3 — “Final Boss Contender”</div>
          </div>
          <div className="divider" />
          <div className="kpiBig">
            <div className="num">B Tier</div>
            <div className="lbl">Top 4–10 — “Tournament Ready”</div>
          </div>
        </div>
      </div>
    </div>
  );
}
