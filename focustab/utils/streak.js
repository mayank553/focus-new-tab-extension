// Counts consecutive days with a completed journal entry, ending at today
// or yesterday (today's reflection may not be done yet).
// The focus-was-set check is enforced upstream when saving an entry.
export function calculateStreak(journalEntries) {
  if (!journalEntries || journalEntries.length === 0) return 0;

  const entryDates = new Set(journalEntries.map((e) => e.date));

  const cursor = new Date();

  // If today has no entry yet, start the count from yesterday
  if (!entryDates.has(dateString(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (entryDates.has(dateString(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function dateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
