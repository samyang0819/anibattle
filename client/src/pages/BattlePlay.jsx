import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function BattlePlay() {
  // Route param: /battle/:id
  // This is the battle document id in MongoDB.
  const { id } = useParams();
  const nav = useNavigate();

  // Battle payload from backend (status, questions, opponent info, etc.)
  const [battle, setBattle] = useState(null);

  // Player's answers, stored by question index (0..n-1).
  // We keep this on the client until submit.
  const [answers, setAnswers] = useState([]);

  // Review payload (only exists when battle is completed)
  // Contains correct answers + what you picked.
  const [result, setResult] = useState(null);

  // UI feedback states
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingResult, setLoadingResult] = useState(false);

  // We show one question at a time.
  // currentIndex controls which question the player is viewing.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Convenience values
  const total = battle?.questions?.length || 0;
  const status = battle?.status;

  // True only when every question has an answer.
  // This prevents accidental submissions with missing picks.
  const allAnswered = useMemo(() => {
    if (!total) return false;
    if (answers.length !== total) return false;
    return answers.every(a => a !== null && a !== undefined);
  }, [answers, total]);

  async function loadBattle() {
    setErr("");
    try {
      // Pull latest battle state from server (status can change anytime)
      const data = await api(`/battles/${id}`);
      setBattle(data);

      // When battle payload changes, reset to the first question
      // so we don't end up pointing at an out-of-range index.
      setCurrentIndex(0);

      // Make sure answers array matches question count.
      // If questions load later (or count changes), this prevents crashes.
      setAnswers(prev => {
        const n = data.questions?.length || 0;
        if (n === 0) return [];
        if (prev.length === n) return prev; // keep existing answers if same size
        return new Array(n).fill(null);
      });
    } catch (e) {
      setErr(e.message);
    }
  }

  async function loadResult() {
    // Result is separate from /:id because we only need it
    // once the battle is completed.
    setLoadingResult(true);
    setErr("");
    try {
      const data = await api(`/battles/${id}/result`);
      setResult(data);
    } catch (e) {
      setResult(null);
      setErr(e.message);
    } finally {
      setLoadingResult(false);
    }
  }

  // When battle id changes, fetch that battle immediately.
  useEffect(() => {
    loadBattle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // When status flips to completed, auto-fetch review data.
  // This makes the "correct answer" screen appear automatically.
  useEffect(() => {
    if (status === "completed") loadResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function submit() {
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      // Hard guard: don't allow partial submissions.
      if (!allAnswered) {
        setErr("Answer all questions before submitting.");
        return;
      }

      // Submit answers to server for scoring.
      // Server stores answers + score, and completes battle when both players submit.
      const data = await api(`/battles/${id}/submit`, {
        method: "POST",
        body: { answers }
      });

      setMsg(data?.message || "Submitted!");

      // Refresh battle state after submitting (status might change)
      await loadBattle();

      // If battle completed instantly (opponent already submitted),
      // fetch review right away
      if (data?.battleStatus === "completed") {
        await loadResult();
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Current question + choices for the "one question at a time" UI
  const currentQ = battle?.questions?.[currentIndex];
  const currentChoices = currentQ?.choices || [];

  // Selected choice index for current question
  const selected = answers[currentIndex];

  return (
    <div className="arenaShell">
      <div className="arenaTop">
        <div>
          <h1 className="arenaTitle">Battle Arena</h1>
          <div className="arenaSub">
            Lock in your answers. When both players submit, the fight resolves.
          </div>
        </div>

        {/* Small HUD so players always know what's going on */}
        <div className="hud">
          <span className="hudChip">
            <span className="hudDot" />
            Status: <b>{status ?? "..."}</b>
          </span>
          <span className="hudChip">
            You: <b>{battle?.youAre ?? "..."}</b>
          </span>
          <span className="hudChip">
            Opponent: <b>{battle?.opponentUsername ?? "..."}</b>
          </span>
          <span className="hudChip">
            Score: <b>{battle?.yourScore ?? "—"}</b>
          </span>
        </div>
      </div>

      {/* Basic UI feedback */}
      {err && <div className="notice noticeBad">{err}</div>}
      {msg && <div className="notice noticeGood">{msg}</div>}

      {!battle && <div className="notice">Loading…</div>}

      {/* PENDING: opponent has not accepted yet */}
      {battle && status === "pending" && (
        <div className="arenaPanel">
          <div className="arenaInner">
            <div className="qBig">Waiting for opponent…</div>
            <div className="arenaSub">
              Once they accept, the questions will appear.
            </div>
          </div>

          <div className="arenaFooter">
            <div className="arenaFooterLeft">
              <div style={{ fontWeight: 950 }}>Stuck?</div>
              <p className="sub">Refresh to check status.</p>
            </div>
            <div className="arenaBtns">
              <button className="btnGhost" onClick={() => nav("/battle")}>
                Back to Lobby
              </button>
              <button className="btn" onClick={loadBattle}>
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE: battle is live, questions are available */}
      {battle && status === "active" && (
        <div className="arenaPanel">
          <div className="arenaInner">
            {/* Match metadata: useful and simple, but no "10/10 progress" */}
            <div className="qMeta">
              <span>Match: <b>{id}</b></span>
              <span>Submitted: <b>{battle?.submitted ? "Yes" : "No"}</b></span>
              <span>Opponent submitted: <b>{battle?.opponentSubmitted ? "Yes" : "No"}</b></span>
            </div>

            <h2 className="qBig">
              {currentQ?.prompt ?? "Loading question…"}
            </h2>

            {/* Choices are styled as "attacks" to feel like a game */}
            <div className="attackGrid">
              {currentChoices.map((c, i) => (
                <div
                  key={i}
                  className={`attackBtn ${selected === i ? "selected" : ""}`}
                  onClick={() => {
                    // Update just the current answer slot
                    const copy = [...answers];
                    copy[currentIndex] = i;
                    setAnswers(copy);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="attackKey">{String.fromCharCode(65 + i)}</div>
                  <div className="attackText">{c}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="arenaFooter">
            <div className="arenaFooterLeft">
              <div style={{ fontWeight: 950 }}>No progress counter</div>
              <p className="sub">Just pick answers and submit once.</p>
            </div>
            
            {/* Navigation + submit controls */}
            <div className="arenaBtns">
              <button
                className="btnGhost"
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={loading || currentIndex === 0}
              >
                Back
              </button>

              {currentIndex < total - 1 ? (
                <button
                  className="btn"
                  onClick={() => setCurrentIndex(i => i + 1)}
                  disabled={loading || selected === null || selected === undefined}
                >
                  Next
                </button>
              ) : (
                <button className="btn" onClick={submit} disabled={loading}>
                  {loading ? "Submitting…" : "Submit"}
                </button>
              )}

              {/* Manual refresh helps when opponent submits and status changes */}
              <button className="btnGhost" onClick={loadBattle} disabled={loading}>
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED: show scores + review (wrong/correct) */}
      {battle && status === "completed" && (
        <div className="arenaPanel">
          <div className="arenaInner">
            <div className="qBig">Battle completed 🎉</div>

            <div className="qMeta" style={{ marginTop: 6 }}>
              <span>You: <b>{result?.yourScore ?? battle?.yourScore ?? "—"}</b></span>
              <span>Opponent: <b>{result?.opponentScore ?? battle?.opponentScore ?? "—"}</b></span>
              <span>Winner: <b>{result?.winner ?? "—"}</b></span>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn" onClick={() => nav("/battle")}>Back to Lobby</button>
              <button className="btnGhost" onClick={loadBattle}>Refresh</button>
              <button className="btnGhost" onClick={loadResult} disabled={loadingResult}>
                {loadingResult ? "Loading review…" : "Reload review"}
              </button>
            </div>

            <div className="divider" />

            {/* Review list: shows what you picked vs correct answer */}
            {result?.review?.length ? (
              <div style={{ display: "grid", gap: 12 }}>
                {result.review.map((q, i) => {
                  const yourText =
                    q.yourAnswer >= 0 && q.choices?.[q.yourAnswer]
                      ? q.choices[q.yourAnswer]
                      : "No answer";

                  const correctText =
                    q.correctIndex >= 0 && q.choices?.[q.correctIndex]
                      ? q.choices[q.correctIndex]
                      : "Unknown";

                  return (
                    <div key={q.id || i} className="qCard">
                      <div className="qTitle">Q{i + 1}: {q.prompt}</div>
                      <div className="sub" style={{ marginTop: 6 }}>
                        Your answer: <b>{yourText}</b>
                      </div>
                      <div className="sub">
                        Correct answer: <b>{correctText}</b>
                      </div>
                      <div
                        className={`notice ${q.isCorrect ? "noticeGood" : "noticeBad"}`}
                        style={{ marginTop: 10 }}
                      >
                        {q.isCorrect ? "✅ Correct" : "❌ Missed"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // If this shows up, it usually means /battles/:id/result isn't implemented
              <div className="notice">
                No review data loaded yet.
                <div className="sub" style={{ marginTop: 6 }}>
                  Make sure your backend supports <b>GET /battles/:id/result</b>.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}