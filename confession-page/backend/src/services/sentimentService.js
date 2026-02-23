import Sentiment from 'sentiment';

const analyzer = new Sentiment();

/**
 * Analyze text and return sentiment label
 * score < -3 → Sad
 * -3 to -1  → Regret
 * 0         → Neutral
 * 1 to 3    → Romantic
 * > 3       → Funny
 */
export const analyzeSentiment = (text) => {
  const result = analyzer.analyze(text);
  const score = result.score;

  if (score < -3) return 'Sad';
  if (score >= -3 && score < 0) return 'Regret';
  if (score === 0) return 'Neutral';
  if (score >= 1 && score <= 3) return 'Romantic';
  if (score > 3) return 'Funny';
  return 'Neutral';
};
