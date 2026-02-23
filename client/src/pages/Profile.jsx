import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

/**
 * Clamp a number into the [0, 1] range.
 * Mainly used for progress bar widths so we never overflow UI.
 */
function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

export default function Profile() {
  // "me" is the logged-in user's profile payload from the backend
  const [me, setMe] = useState(null);

  // If something goes wrong (token invalid, server down, etc.)
  // we show a single clean error message.
  const [err, setErr] = useState("");

  useEffect(() => {
    // Fetch the current user profile once on mount.
    // We keep this page simple: load once, then render stats.
    api("/users/me")
      .then(setMe)
      .catch(e => setErr(e.message));
  }, []);

  // Accuracy = correct / total.
  // Memoized because it’s derived data and avoids recalculating every render.
  const acc = useMemo(() => {
    if (!me?.stats?.totalAnswered) return 0;
    return me.stats.correctAnswered / me.stats.totalAnswered;
  }, [me]);

  // Winrate = wins / (wins + losses).
  // Guarded so we don’t divide by zero for new users.
  const wlTotal = (me?.stats?.wins ?? 0) + (me?.stats?.losses ?? 0);
  const winRate = wlTotal ? (me.stats.wins / wlTotal) : 0;

  // Early returns keep rendering logic clean.
  if (err) return <div className="notice noticeBad">{err}</div>;
  if (!me) return <div className="notice">Loading profile…</div>;

  // Simple avatar fallback: just initials from username.
  // Looks nicer than an empty circle.
  const initials = (me.username || "P").slice(0, 2).toUpperCase();

  return (
    <div className="hero" style={{ gridTemplateColumns: "1.15fr .85fr" }}>
      {/* LEFT: MAIN PROFILE CARD */}
      <div className="card">
        <div className="cardHeader">
          <div className="profileTop">
            {/* Minimal "game profile" avatar */}
            <div className="avatar">
              <div className="avatarInner">{initials}</div>
            </div>

            <div style={{ flex: 1 }}>
              <div className="h1" style={{ fontSize: 44, marginBottom: 6 }}>
                {me.username}
              </div>
              
              {/* Quick headline stats */}
              <div className="sub">
                Points: <b>{me.points}</b> • Difficulty: <b>{me.preferredDifficulty}</b>
              </div>

              {/* Tiny chips = quick-glance stats */}
              <div className="chipRow" style={{ marginTop: 12 }}>
                <span className="miniChip">🎯 Accuracy {(acc * 100).toFixed(1)}%</span>
                <span className="miniChip">⚔️ W/L {me.stats.wins}/{me.stats.losses}</span>
                <span className="miniChip">🔥 Winrate {(winRate * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cardBody">
        {/* Stat tiles: readable numbers + short labels */}
          <div className="statGrid">
            <div className="statTile">
              <div className="statLabel">Total Answered</div>
              <div className="statValue">{me.stats.totalAnswered}</div>
              <div className="statHint">Lifetime questions completed</div>
            </div>

            <div className="statTile">
              <div className="statLabel">Correct</div>
              <div className="statValue">{me.stats.correctAnswered}</div>
              <div className="statHint">Correct answers overall</div>
            </div>

            <div className="statTile">
              <div className="statLabel">Points</div>
              <div className="statValue">{me.points}</div>
              <div className="statHint">Solo + battles contribute</div>
            </div>

            <div className="statTile">
              <div className="statLabel">Recommended Difficulty</div>
              <div className="statValue">{me.preferredDifficulty}</div>
              <div className="statHint">Adaptive scaling target</div>
            </div>
          </div>

          <div className="divider" />

          {/* Progress bars: visual feedback so the page feels like a game UI */}
          <div className="barBlock">
            <div className="barRow">
              <div>
                <div className="barTitle">Accuracy</div>
                <div className="sub">Aim for 75%+ to climb difficulty faster.</div>
              </div>
              <div className="barPct">{(acc * 100).toFixed(1)}%</div>
            </div>
            
            <div className="bar">
              {/* clamp just protects against weird edge cases */}
              <div
                className="barFill"
                style={{ width: `${clamp01(acc) * 100}%` }}
              />
            </div>
          </div>

          <div className="barBlock" style={{ marginTop: 14 }}>
            <div className="barRow">
              <div>
                <div className="barTitle">Win Rate</div>
                <div className="sub">Battle results (wins / total battles).</div>
              </div>
              <div className="barPct">{(winRate * 100).toFixed(0)}%</div>
            </div>

            <div className="bar">
              <div
                className="barFill"
                style={{ width: `${clamp01(winRate) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}