const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    createdAt: { type: Date, default: Date.now },
    mode: { type: String, enum: ["solo"], default: "solo" },
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }],
    answers: [{ type: Number, min: 0, max: 3 }],
    score: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }
  },
  { timestamps: false }
);

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);
