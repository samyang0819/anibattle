const mongoose = require("mongoose");

const BattleSchema = new mongoose.Schema(
  {
    player1Id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    player2Id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    category: { type: String },
    difficulty: { type: Number },

    status: { type: String, enum: ["pending", "active", "completed"], default: "pending" },

    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }],

    p1Answers: [{ type: Number, min: 0, max: 3 }],
    p2Answers: [{ type: Number, min: 0, max: 3 }],

    p1Score: { type: Number, default: 0 },
    p2Score: { type: Number, default: 0 },

    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Battle", BattleSchema);
