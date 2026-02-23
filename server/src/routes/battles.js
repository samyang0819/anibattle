// backend/routes/battles.js — FIXED & COMPLETE (ALL DIFFICULTIES + ORDER SAFE)
const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const Battle = require("../models/Battle");
const Question = require("../models/Question");
const User = require("../models/User");

/**
 * Helper: fetch questions by ids AND preserve the original order.
 */
async function fetchQuestionsInOrder(questionIds) {
  const qs = await Question.find({ _id: { $in: questionIds } }).lean();
  const map = new Map(qs.map(q => [q._id.toString(), q]));
  return questionIds.map(id => map.get(id.toString())).filter(Boolean);
}

/**
 * Helper: pick questions for battle.
 * - Uses ALL difficulties by default (category only).
 * - If not enough, it will just return whatever exists (still valid battle).
 */
async function pickBattleQuestions({ category, count = 10 }) {
  const countNum = Number(count) || 10;

  const questions = await Question.aggregate([
    { $match: { category } },           // ✅ ALL difficulties
    { $sample: { size: countNum } }
  ]);

  return questions; // may be < countNum if DB has fewer
}

// GET /inbox — List user's battles by status
router.get("/inbox", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user._id.toString();

    const [pending, active, completed] = await Promise.all([
      Battle.find({
        $or: [{ player1Id: userId }, { player2Id: userId }],
        status: "pending",
      }).populate("player1Id player2Id", "username").lean(),

      Battle.find({
        $or: [{ player1Id: userId }, { player2Id: userId }],
        status: "active",
      }).populate("player1Id player2Id", "username").lean(),

      Battle.find({
        $or: [{ player1Id: userId }, { player2Id: userId }],
        status: "completed",
      }).populate("player1Id player2Id winnerId", "username").lean(),
    ]);

    const format = (b) => {
      const isP1 = b.player1Id._id.toString() === userId;
      return {
        id: b._id,
        opponentUsername: isP1 ? b.player2Id.username : b.player1Id.username,
        category: b.category,
        difficulty: b.difficulty, // keep field for compatibility (see create below)
        questionCount: b.questionIds?.length || 0,
        status: b.status,
        yourScore: isP1 ? b.p1Score : b.p2Score,
        opponentScore: isP1 ? b.p2Score : b.p1Score,
        createdAt: b.createdAt,
      };
    };

    res.json({
      pending: pending.map(format),
      active: active.map(format),
      completed: completed.map(format),
    });
  } catch (e) { next(e); }
});

// POST /create — Challenge a user
router.post("/create", requireAuth, async (req, res, next) => {
  try {
    const { opponentUsername, category, count = 10 } = req.body;
    const challengerId = req.user._id;

    if (!opponentUsername || !category) {
      return res.status(400).json({ error: "opponentUsername and category required" });
    }

    const opponent = await User.findOne({ username: opponentUsername });
    if (!opponent) return res.status(404).json({ error: "Opponent not found" });
    if (opponent._id.toString() === challengerId.toString()) {
      return res.status(400).json({ error: "Cannot challenge yourself" });
    }

    // ✅ pick across all difficulties
    const picked = await pickBattleQuestions({ category, count });

    if (!picked.length) {
      return res.status(404).json({ error: "No questions found for this category" });
    }

    // Keep a "difficulty" field for backwards compatibility.
    // Since it's mixed now, set it to 0 or "mixed" style value.
    // If your schema expects Number, keep 0.
    const battle = await Battle.create({
      player1Id: challengerId,
      player2Id: opponent._id,
      category,
      difficulty: 0, // ✅ mixed
      status: "pending",
      questionIds: picked.map(q => q._id),
    });

    res.json({
      battle: {
        id: battle._id,
        opponentUsername: opponent.username,
        status: "pending",
        message: "Challenge sent!",
      }
    });
  } catch (e) { next(e); }
});

// GET /:id — Get battle details + questions (if active)
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const battle = await Battle.findById(req.params.id)
      .populate("player1Id player2Id", "username")
      .lean();

    if (!battle) return res.status(404).json({ error: "Battle not found" });

    const userId = req.user._id.toString();
    const isPlayer1 = battle.player1Id._id.toString() === userId;
    const isPlayer2 = battle.player2Id._id.toString() === userId;

    if (!isPlayer1 && !isPlayer2) {
      return res.status(403).json({ error: "Not authorized to view this battle" });
    }

    const youAre = isPlayer1 ? "player1" : "player2";
    const submitted = isPlayer1 ? (battle.p1Answers?.length > 0) : (battle.p2Answers?.length > 0);
    const opponentSubmitted = isPlayer1 ? (battle.p2Answers?.length > 0) : (battle.p1Answers?.length > 0);

    let questions = [];
    if (battle.status === "active") {
      const ordered = await fetchQuestionsInOrder(battle.questionIds);

      // ✅ preserve order + include difficulty per question
      questions = ordered.map(q => ({
        id: q._id,
        prompt: q.prompt,
        choices: q.choices,
        category: q.category,
        difficulty: q.difficulty,
      }));
    }

    res.json({
      id: battle._id,
      status: battle.status,
      category: battle.category,
      difficulty: battle.difficulty, // 0 means mixed
      youAre,
      submitted,
      opponentSubmitted,
      questions,
      yourScore: isPlayer1 ? battle.p1Score : battle.p2Score,
      opponentScore: isPlayer1 ? battle.p2Score : battle.p1Score,
      opponentUsername: isPlayer1 ? battle.player2Id.username : battle.player1Id.username,
    });
  } catch (e) { next(e); }
});

// POST /:id/accept — Accept a pending battle
router.post("/:id/accept", requireAuth, async (req, res, next) => {
  try {
    const battle = await Battle.findById(req.params.id);
    if (!battle) return res.status(404).json({ error: "Battle not found" });

    const userId = req.user._id.toString();

    // Only player2 can accept (player1 is challenger)
    if (battle.player2Id.toString() !== userId) {
      return res.status(403).json({ error: "Only the invited player can accept" });
    }
    if (battle.status !== "pending") {
      return res.status(400).json({ error: "Battle is no longer pending" });
    }

    battle.status = "active";
    await battle.save();

    res.json({ battle: { id: battle._id, status: "active", message: "Battle accepted! Good luck ⚔️" } });
  } catch (e) { next(e); }
});

// POST /:id/submit — Submit answers
router.post("/:id/submit", requireAuth, async (req, res, next) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "answers must be an array" });
    }

    const battle = await Battle.findById(req.params.id);
    if (!battle) return res.status(404).json({ error: "Battle not found" });
    if (battle.status !== "active") {
      return res.status(400).json({ error: "Battle is not active" });
    }

    const userId = req.user._id.toString();
    const isPlayer1 = battle.player1Id.toString() === userId;

    // Prevent double submission
    if (isPlayer1 && battle.p1Answers?.length > 0) {
      return res.status(400).json({ error: "You have already submitted" });
    }
    if (!isPlayer1 && battle.p2Answers?.length > 0) {
      return res.status(400).json({ error: "You have already submitted" });
    }

    // ✅ score with correct order
    const orderedQuestions = await fetchQuestionsInOrder(battle.questionIds);

    let correct = 0;
    for (let i = 0; i < orderedQuestions.length; i++) {
      const q = orderedQuestions[i];
      if (!q) continue;
      if (answers[i] === q.correctIndex) correct++;
    }

    // Update battle
    if (isPlayer1) {
      battle.p1Answers = answers;
      battle.p1Score = correct;
    } else {
      battle.p2Answers = answers;
      battle.p2Score = correct;
    }

    // If both submitted → determine winner + update stats
    const p1Done = battle.p1Answers?.length > 0;
    const p2Done = battle.p2Answers?.length > 0;

    if (p1Done && p2Done) {
      battle.status = "completed";

      if (battle.p1Score > battle.p2Score) battle.winnerId = battle.player1Id;
      else if (battle.p2Score > battle.p1Score) battle.winnerId = battle.player2Id;
      // tie => no winnerId

      const totalQ = battle.questionIds.length;

      // ✅ increment points (not overwrite)
      await User.findByIdAndUpdate(battle.player1Id, {
        $inc: {
          "stats.totalAnswered": totalQ,
          "stats.correctAnswered": battle.p1Score,
          points: battle.p1Score,
          ...(battle.p1Score > battle.p2Score
            ? { "stats.wins": 1 }
            : battle.p1Score < battle.p2Score
            ? { "stats.losses": 1 }
            : {})
        }
      });

      await User.findByIdAndUpdate(battle.player2Id, {
        $inc: {
          "stats.totalAnswered": totalQ,
          "stats.correctAnswered": battle.p2Score,
          points: battle.p2Score,
          ...(battle.p2Score > battle.p1Score
            ? { "stats.wins": 1 }
            : battle.p2Score < battle.p1Score
            ? { "stats.losses": 1 }
            : {})
        }
      });
    }

    await battle.save();

    res.json({
      yourScore: correct,
      battleStatus: battle.status,
      message: battle.status === "completed"
        ? "Battle complete! 🎉"
        : "Submitted! Waiting for opponent...",
    });
  } catch (e) { next(e); }
});

// GET /:id/result — Only when completed, returns review (your answers + correct answers)
router.get("/:id/result", requireAuth, async (req, res, next) => {
  try {
    const battle = await Battle.findById(req.params.id)
      .populate("player1Id player2Id winnerId", "username")
      .lean();

    if (!battle) return res.status(404).json({ error: "Battle not found" });
    if (battle.status !== "completed") {
      return res.status(400).json({ error: "Battle not completed" });
    }

    const userId = req.user._id.toString();
    const isP1 = battle.player1Id._id.toString() === userId;
    const isP2 = battle.player2Id._id.toString() === userId;
    if (!isP1 && !isP2) return res.status(403).json({ error: "Not authorized" });

    const yourAnswers = isP1 ? battle.p1Answers : battle.p2Answers;

    // ✅ preserve order
    const ordered = await fetchQuestionsInOrder(battle.questionIds);

    const review = ordered.map((q, idx) => {
      const yourAnswer = yourAnswers?.[idx] ?? -1;
      const correctIndex = q?.correctIndex ?? -1;

      return {
        id: q?._id ?? battle.questionIds[idx],
        prompt: q?.prompt ?? "(missing question)",
        choices: q?.choices ?? [],
        yourAnswer,
        correctIndex,
        isCorrect: yourAnswer === correctIndex,
      };
    });

    res.json({
      id: battle._id,
      status: battle.status,
      category: battle.category,
      difficulty: battle.difficulty, // 0 mixed
      yourScore: isP1 ? battle.p1Score : battle.p2Score,
      opponentScore: isP1 ? battle.p2Score : battle.p1Score,
      winner: battle.winnerId ? battle.winnerId.username : "tie",
      opponentUsername: isP1 ? battle.player2Id.username : battle.player1Id.username,
      review,
    });
  } catch (e) { next(e); }
});

module.exports = router;