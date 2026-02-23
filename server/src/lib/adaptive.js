function clampDifficulty(n) {
  return Math.max(1, Math.min(5, n));
}

function computeNextDifficulty(currentDifficulty, recentAnswers) {
  // recentAnswers: array of booleans, last up to 20
  if (!recentAnswers || recentAnswers.length === 0) return clampDifficulty(currentDifficulty);

  const total = recentAnswers.length;
  const correct = recentAnswers.filter(Boolean).length;
  const accuracy = (correct / total) * 100;

  if (accuracy > 75) return clampDifficulty(currentDifficulty + 1);
  if (accuracy < 45) return clampDifficulty(currentDifficulty - 1);
  return clampDifficulty(currentDifficulty);
}

function pushRecent(recentAnswers, isCorrect) {
  const arr = Array.isArray(recentAnswers) ? [...recentAnswers] : [];
  arr.push(Boolean(isCorrect));
  // keep last 20
  while (arr.length > 20) arr.shift();
  return arr;
}

module.exports = { computeNextDifficulty, pushRecent, clampDifficulty };
