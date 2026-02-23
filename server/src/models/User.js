const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },

    stats: {
      totalAnswered: { type: Number, default: 0 },
      correctAnswered: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 }
    },

    // simple rating/points for leaderboard (MVP)
    points: { type: Number, default: 0 },

    // used for adaptive difficulty
    recentAnswers: {
      // store last 20 as booleans: true=correct false=wrong
      type: [Boolean],
      default: []
    },

    preferredDifficulty: { type: Number, default: 2 } // 1–5
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
