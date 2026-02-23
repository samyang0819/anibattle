const router = require("express").Router();
const Question = require("../models/Question");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// public browse (optional)
router.get("/", async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = Number(difficulty);

    const qs = await Question.find(filter).limit(100).lean();
    res.json({ questions: qs });
  } catch (e) { next(e); }
});

// admin create
router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const q = await Question.create(req.body);
    res.json({ question: q });
  } catch (e) { next(e); }
});

// admin update
router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return res.status(404).json({ error: "Not found" });
    res.json({ question: q });
  } catch (e) { next(e); }
});

// admin delete
router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const q = await Question.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
