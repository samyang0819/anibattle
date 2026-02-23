import React, { useMemo, useState } from "react";
import { api } from "../lib/api";

export default function Solo() {
  // Configuration before starting a run
  const [category, setCategory] = useState("Shonen");
  const [useAdaptive, setUseAdaptive] = useState(true);
  const [difficulty, setDifficulty] = useState(2);

  // Quiz payload from backend
  const [quiz, setQuiz] = useState(null);

  // Player answers stored by index (0..9)
  const [answers, setAnswers] = useState([]);

  // Result after submission
  const [result, setResult] = useState(null);

  // UI state
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Current question index (one-question-at-a-time flow)
  const [idx, setIdx] = useState(0);

  const totalCount = quiz?.questions?.length || 0;

  // How many questions have an answer selected
  const answeredCount = useMemo(
    () => answers.filter(a => a !== null && a !== undefined).length,
    [answers]
  );

  async function start() {
    // Reset previous run state
    setErr("");
    setResult(null);
    setLoading(true);

    try {
      // Ask backend to generate a 10-question quiz
      const data = await api("/quiz/start", {
        method: "POST",
        body: { category, difficulty, useAdaptive, count: 10 }
      });

      setQuiz(data);

      // Ask backend to generate a 10-question quiz
      setAnswers(new Array(data.questions.length).fill(null));

      // Always start from question 1
      setIdx(0);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    setErr("");
    setLoading(true);
    try {
      // Extract question ids in same order they were displayed
      const questionIds = quiz.questions.map(q => q.id);

      // Replace unanswered slots with -1 (backend-friendly default)
      const data = await api("/quiz/submit", {
        method: "POST",
        body: { questionIds, answers: answers.map(a => (a ?? -1)) }
      });

      // Store scoring payload
      setResult(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    // Clear everything and return to config state
    setQuiz(null);
    setResult(null);
    setAnswers([]);
    setErr("");
    setIdx(0);
  }

  const q = quiz?.questions?.[idx];
  const selected = answers[idx];

  return (
    <div className="arenaShell">
      <div className="arenaTop">
        <div>
          <h1 className="arenaTitle">Solo Arena</h1>
          <div className="arenaSub">
            One question at a time. Pick an “attack”, lock it in, move forward.
          </div>
        </div>

        {/* Minimal HUD so player always knows run context */}
        <div className="hud">
          <span className="hudChip">
            <span className="hudDot" />
            Mode: <b>{useAdaptive ? "Adaptive" : "Manual"}</b>
          </span>

          <span className="hudChip">
            Difficulty: <b>{quiz?.difficultyUsed ?? difficulty}</b>
          </span>

          <span className="hudChip">
            Answered: <b>{answeredCount}/{totalCount || 10}</b>
          </span>
        </div>
      </div>

      {err && <div className="notice noticeBad">{err}</div>}

      {/* CONFIGURATION SCREEN */}
      {!quiz && (
        <div className="arenaPanel">
          <div className="arenaInner">
            <div className="qBig">Configure your run</div>

            {/* Small flavor metadata to make it feel game-like */}
            <div className="qMeta">
              <span>🎯 10 questions</span>
              <span>⚡ fast pacing</span>
              <span>🏆 score + next difficulty</span>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="label">Category</label>
                <input
                  className="input"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="Shonen"
                />
              </div>

              <div className="field">
                <label className="label">Mode</label>
                <select
                  className="select"
                  value={useAdaptive ? "adaptive" : "manual"}
                  onChange={e => setUseAdaptive(e.target.value === "adaptive")}
                >
                  <option value="adaptive">📈 Adaptive</option>
                  <option value="manual">🎯 Manual</option>
                </select>
              </div>
            </div>

            {/* Only show manual difficulty selector when adaptive is off */}
            {!useAdaptive && (
              <div className="field">
                <label className="label">Difficulty (1–5)</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  max="5"
                  value={difficulty}
                  onChange={e => setDifficulty(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div className="arenaFooter">
            <div className="arenaFooterLeft">
              <div style={{ fontWeight: 950 }}>Ready?</div>
              <p className="sub">Start the run and the arena will load instantly.</p>
            </div>

            <div className="arenaBtns">
              <button className="btn" onClick={start} disabled={loading}>
                {loading ? "Summoning…" : "⚔️ Start Run"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION VIEW */}
      {quiz && !result && q && (
        <div className="arenaPanel">
          <div className="arenaInner">
            <div className="qMeta">
              <span>Question <b>{idx + 1}</b> / {totalCount}</span>
              <span>Category: <b>{quiz.category}</b></span>
            </div>

            <h2 className="qBig">{q.prompt}</h2>
            
            {/* Answer choices styled like “attacks” */}
            <div className="attackGrid">
              {q.choices.map((c, i) => (
                <div
                  key={i}
                  className={`attackBtn ${selected === i ? "selected" : ""}`}
                  onClick={() => {
                    const copy = [...answers];
                    copy[idx] = i;
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
              <div style={{ fontWeight: 950 }}>Choose your move</div>
              <p className="sub">No scrolling. Pure focus.</p>
            </div>

            <div className="arenaBtns">
              <button
                className="btnGhost"
                onClick={() => setIdx(Math.max(0, idx - 1))}
                disabled={loading || idx === 0}
              >
                Back
              </button>

              {idx < totalCount - 1 ? (
                <button
                  className="btn"
                  onClick={() => setIdx(idx + 1)}
                  disabled={loading || selected === null || selected === undefined}
                >
                  Next
                </button>
              ) : (
                <button
                  className="btn"
                  onClick={submit}
                  disabled={loading || answers.some(a => a === null || a === undefined)}
                >
                  {loading ? "Submitting…" : "Submit"}
                </button>
              )}

              <button className="btnGhost" onClick={reset} disabled={loading}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESULT SCREEN */}
      {result && (
        <div className="notice noticeGood">
          🎉 Score: <b>{result.score}/{result.total}</b> • Accuracy:{" "}
          <b>{(result.accuracy * 100).toFixed(1)}%</b> • Next:{" "}
          <b>Difficulty {result.nextRecommendedDifficulty}</b>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={reset}>Run Again</button>
          </div>
        </div>
      )}
    </div>
  );
}