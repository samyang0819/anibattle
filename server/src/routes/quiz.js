const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");
const User = require("../models/User");
const { computeNextDifficulty, pushRecent } = require("../lib/adaptive");

// Create quiz: pick category + difficulty (or "adaptive")
router.post("/start", requireAuth, async (req, res, next) => {
  try {
    const { category, difficulty, count = 10, useAdaptive = false } = req.body;

    if (!category) return res.status(400).json({ error: "category required" });

    const user = await User.findById(req.user._id);
    const baseDifficulty = useAdaptive ? user.preferredDifficulty : difficulty;
    const diff = Number(baseDifficulty || 2);

    const questions = await Question.aggregate([
      { $match: { category, difficulty: diff } },
      { $sample: { size: Number(count) } }
    ]);

    if (questions.length < Number(count)) {
      // fallback: any difficulty in category to fill
      const needed = Number(count) - questions.length;
      const more = await Question.aggregate([
        { $match: { category } },
        { $sample: { size: needed } }
      ]);
      questions.push(...more);
    }

    const sanitized = questions.map(q => ({
      id: q._id,
      prompt: q.prompt,
      choices: q.choices,
      category: q.category,
      difficulty: q.difficulty
    }));

    res.json({ questions: sanitized, difficultyUsed: diff });
  } catch (e) { next(e); }
});

// Submit quiz: compute score, store attempt, update stats + adaptive difficulty
router.post("/submit", requireAuth, async (req, res, next) => {
  try {
    const { questionIds, answers } = req.body;
    if (!Array.isArray(questionIds) || !Array.isArray(answers) || questionIds.length !== answers.length) {
      return res.status(400).json({ error: "questionIds and answers must match in length" });
    }

    const questions = await Question.find({ _id: { $in: questionIds } }).lean();
    const map = new Map(questions.map(q => [q._id.toString(), q]));

    let correct = 0;
    const correctness = [];

    for (let i = 0; i < questionIds.length; i++) {
      const q = map.get(String(questionIds[i]));
      if (!q) continue;
      const ok = Number(answers[i]) === q.correctIndex;
      correctness.push(ok);
      if (ok) correct++;
    }

    const score = correct;
    const accuracy = questionIds.length ? correct / questionIds.length : 0;

    await QuizAttempt.create({
      userId: req.user._id,
      mode: "solo",
      questionIds,
      answers,
      score,
      accuracy
    });

    // update user stats + recentAnswers + preferredDifficulty
    const user = await User.findById(req.user._id);
    user.stats.totalAnswered += questionIds.length;
    user.stats.correctAnswered += correct;

    let recent = user.recentAnswers;
    for (const ok of correctness) recent = pushRecent(recent, ok);
    user.recentAnswers = recent;

    const currentDiff = user.preferredDifficulty || 2;
    user.preferredDifficulty = computeNextDifficulty(currentDiff, user.recentAnswers);

    // points MVP: +score
    user.points += score;

    await user.save();

    res.json({
      score,
      correct,
      total: questionIds.length,
      accuracy,
      nextRecommendedDifficulty: user.preferredDifficulty
    });
  } catch (e) { next(e); }
});

module.exports = router;
