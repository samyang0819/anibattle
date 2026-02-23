const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const User = require("../models/User");

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean();
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      stats: user.stats,
      points: user.points,
      preferredDifficulty: user.preferredDifficulty
    });
  } catch (e) { next(e); }
});

module.exports = router;
