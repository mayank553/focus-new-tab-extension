/**
 * quotes.js — Daily Motivational Quote data layer
 *
 * Exports:
 *   quotes          — array of 40 motivational strings (each <= 120 chars)
 *   getDailyQuote() — pure function; returns a deterministic quote for a given date
 */

export const quotes = [
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Don't watch the clock; do what it does. Keep going.",
  "Whether you think you can or you think you can't, you're right.",
  "You don't have to be great to start, but you have to start to be great.",
  "Small steps every day lead to big results over time.",
  "Discipline is choosing between what you want now and what you want most.",
  "Focus on progress, not perfection.",
  "Your future is created by what you do today, not tomorrow.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream big, start small, act now.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never came from comfort zones.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little by little, a little becomes a lot.",
  "Don't stop when you're tired. Stop when you're done.",
  "Believe you can and you're halfway there.",
  "Energy and persistence conquer all things.",
  "Act as if what you do makes a difference. It does.",
  "Quality is not an act, it is a habit.",
  "It's not about perfect. It's about effort.",
  "Success doesn't come from what you do occasionally, but from what you do consistently.",
  "The only way to do great work is to love what you do.",
  "Start where you are. Use what you have. Do what you can.",
  "You are never too old to set another goal or to dream a new dream.",
  "Strive for progress, not perfection.",
  "Keep your eyes on the stars and your feet on the ground.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "You've got to get up every morning with determination if you're going to bed with satisfaction.",
  "In the middle of every difficulty lies opportunity.",
  "Everything you've ever wanted is on the other side of fear.",
  "What you get by achieving your goals is not as important as what you become.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "You only fail when you stop trying.",
  "Courage is one step ahead of fear.",
  "The key to success is to focus on goals, not obstacles.",
  "Every day is a chance to be better than yesterday.",
];

/**
 * Returns a deterministic motivational quote for the given date.
 *
 * Algorithm:
 *   1. Compute the number of days elapsed since the local epoch (2024-01-01)
 *      using local calendar date only — NOT UTC — so the quote matches the
 *      user's actual day regardless of timezone.
 *   2. Index into the quotes array using modulo, so the list loops forever.
 *
 * @param {Date} date — defaults to today. Pass any Date for testing.
 * @returns {string} — one quote string
 */
export function getDailyQuote(date = new Date()) {
  const EPOCH = new Date(2024, 0, 1); // 2024-01-01, local time (month is 0-indexed)

  // Strip time-of-day from both dates so we compare calendar days only
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNumber = Math.floor((localDate - EPOCH) / (1000 * 60 * 60 * 24));

  const index = ((dayNumber % quotes.length) + quotes.length) % quotes.length;
  return quotes[index];
}
