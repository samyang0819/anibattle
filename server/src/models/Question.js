const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    choices: { type: [String], required: true, validate: v => v.length === 4 },
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    category: { type: String, required: true, index: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
