const router = require("express").Router();
const User = require("../models/User");
const QuizAttempt = require("../models/QuizAttempt");

router.get("/", async (req, res, next) => {
  try {
    const range = (req.query.range || "all").toLowerCase();

    if (range === "weekly") {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Aggregate quiz points (score) in last 7 days by userId
      const agg = await QuizAttempt.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: "$userId", points: { $sum: "$score" } } },
        { $sort: { points: -1 } },
        { $limit: 50 }
      ]);

      const ids = agg.map(x => x._id);
      const users = await User.find({ _id: { $in: ids } })
        .select("username stats.wins stats.losses stats.correctAnswered stats.totalAnswered")
        .lean();

      const map = new Map(users.map(u => [String(u._id), u]));

      const rows = agg.map(x => {
        const u = map.get(String(x._id));
        return {
          username: u?.username ?? "Unknown",
          points: x.points,
          wins: u?.stats?.wins || 0,
          losses: u?.stats?.losses || 0,
          accuracy: u?.stats?.totalAnswered ? (u.stats.correctAnswered / u.stats.totalAnswered) : 0
        };
      });

      return res.json({ rows, range: "weekly" });
    }

    // all-time (existing)
    const top = await User.find({})
      .sort({ points: -1 })
      .limit(50)
      .select("username points stats.wins stats.losses stats.correctAnswered stats.totalAnswered")
      .lean();

    const rows = top.map(u => ({
      username: u.username,
      points: u.points,
      wins: u.stats?.wins || 0,
      losses: u.stats?.losses || 0,
      accuracy: u.stats?.totalAnswered ? (u.stats.correctAnswered / u.stats.totalAnswered) : 0
    }));

    res.json({ rows, range: "all" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;