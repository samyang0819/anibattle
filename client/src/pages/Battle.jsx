import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

/**
 * Small helper to make battle status more readable.
 * Keeps UI clean instead of repeating emoji logic inline.
 */
function statusLabel(s) {
  if (s === "pending") return "⏳ Pending";
  if (s === "active") return "⚔️ Active";
  if (s === "completed") return "🏁 Completed";
  return s;
}

export default function Battle() {
  const nav = useNavigate();

  // Form state for creating a new challenge
  const [opponentUsername, setOpponentUsername] = useState("");
  const [category, setCategory] = useState("Shonen");
  const [difficulty, setDifficulty] = useState(2);
  const [count, setCount] = useState(10);

  // All battles grouped by status
  const [battles, setBattles] = useState({
    pending: [], 
    active: [], 
    completed: [] 
  });

  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Fetch user's battles from backend.
   * Called on mount and after create/accept actions.
   */ 
  async function refresh() {
    setErr("");
    try {
      const data = await api("/battles/inbox");
      setBattles(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  // Load battles when component first mounts
  useEffect(() => { 
    refresh(); 
  }, []);

  /**
   * Sends challenge to another user.
   * After success, refresh inbox so UI reflects new state.
   */
  async function createBattle() {
    setErr(""); setMsg(""); setLoading(true);
    try {
      await api("/battles/create", {
        method: "POST",
        body: { opponentUsername, category, difficulty, count }
      });
      setMsg("Challenge sent ⚔️");
      setOpponentUsername("");
      await refresh();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Accepts a pending battle invitation.
   * After accepting, immediately navigates into match screen.
   */ 
  async function acceptBattle(id) {
    setErr(""); setMsg(""); setLoading(true);
    try {
      await api(`/battles/${id}/accept`, { method: "POST" });
      setMsg("Battle accepted 🔥");
      await refresh();
      // Jump straight into the match
      nav(`/battle/${id}`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hero">
      <div className="card">

        {/* Battle creation section */}
        <div className="cardHeader">
          <div className="h1">Battle Lobby</div>
          <div className="sub">Turn-based duels. Same questions. Higher score wins.</div>
        </div>

        <div className="cardBody">
          {err && <div className="notice noticeBad">{err}</div>}
          {msg && <div className="notice noticeGood">{msg}</div>}

          {/* Challenge form */}
          <div className="grid2">
            <div className="field">
              <div className="label">Opponent username</div>
              <input className="input" value={opponentUsername} onChange={e=>setOpponentUsername(e.target.value)} />
            </div>

            <div className="field">
              <div className="label">Category</div>
              <input className="input" value={category} onChange={e=>setCategory(e.target.value)} />
            </div>
          </div>

          <div className="grid2">
            <div className="field">
              <div className="label">Difficulty</div>
              <input className="input" type="number" min="1" max="5" value={difficulty} onChange={e=>setDifficulty(Number(e.target.value))}/>
            </div>

            <div className="field">
              <div className="label">Questions</div>
              <input className="input" type="number" min="1" max="20" value={count} onChange={e=>setCount(Number(e.target.value))}/>
            </div>
          </div>

          <button className="btn" onClick={createBattle} disabled={!opponentUsername || loading}>
            {loading ? "Sending…" : "Send Challenge"}
          </button>
        </div>
      </div>

      {/* Battle list section */}
      <div className="card">
        <div className="cardHeader">
          <div className="h1" style={{fontSize:26}}>Your Battles</div>
          <button className="pill" onClick={refresh}>Refresh</button>
        </div>

        <div className="cardBody">
          {["pending","active","completed"].map(key => {
            const list = battles[key] || [];
            return (
              <div key={key} style={{marginBottom:16}}>
                <div style={{fontWeight:900, marginBottom:8}}>
                  {statusLabel(key)} ({list.length})
                </div>

                {list.length === 0 && <div className="notice">Nothing here yet.</div>}

                {list.map((b,i)=>(
                  <motion.div key={b.id}
                    initial={{opacity:0,y:6}}
                    animate={{opacity:1,y:0}}
                    transition={{delay:i*0.05}}
                    className="qCard">

                    <div style={{fontWeight:900}}>
                      You vs {b.opponentUsername}
                    </div>

                    <div className="sub">
                      {b.category} • Difficulty {b.difficulty} • {b.questionCount} questions
                    </div>

                    <div style={{display:"flex",gap:10,marginTop:10}}>
                      {b.status==="pending" && (
                        <button className="btnGhost" onClick={()=>acceptBattle(b.id)}>Accept</button>
                      )}

                      <button className="btn" onClick={()=>nav(`/battle/${b.id}`)}>
                        Open
                      </button>
                    </div>

                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}