# PRD: Daily Motivational Quote

**Project:** FocusTab — Chrome New Tab Productivity Extension
**Feature:** Daily Motivational Quote (Assignment 1 — Easy)
**Status:** Draft for handoff to AI coding tool
**Scope:** V1 only. Do not add Pomodoro, streaks, sync, or themes.

---

## 1. Summary

Display a short motivational quote on the new tab dashboard, below the focus message. The quote is selected deterministically by date, so the same quote shows all day and a new one appears the next day. The quote list is hardcoded for V1 (no Settings UI editing yet — can be a V2 idea).

---

## 2. Decisions Locked for V1

| Question | Decision |
|---|---|
| Quote list source | Hardcoded array of 40 quotes, shipped in code |
| Placement | Directly below the focus message, same vertical stack |
| Looping behavior | Day index wraps via `% quotes.length`, so list loops back to quote #1 after the last one |
| Editable from Settings? | No — out of scope for V1 |
| Backend/network? | No — fully local, no fetch calls |

---

## 3. User-Facing Behavior

- On every new tab open, the dashboard shows (in order, top to bottom): greeting → clock → focus prompt/message → **quote** → task list.
- The quote is plain text, smaller and visually quieter than the focus message (secondary typographic weight).
- The quote does not change on tab refresh/reopen within the same calendar day.
- At local midnight (or whatever day boundary logic already exists for focus reset — reuse it if present), the quote rotates to the next one in the list.
- If the user has been using the extension longer than there are quotes, the list loops back to the start rather than erroring or going blank.

---

## 4. Technical Design

### 4.1 Data
- New file: `quotes.js` (or `data/quotes.js`) exporting a constant array of 40 strings.
- No quote should exceed ~120 characters (keep layout clean on small windows).

### 4.2 Date-based index logic
- Compute a stable "day number" since a fixed epoch (e.g. days since `2024-01-01`), using local date only (not UTC, to match the user's actual day).
- `quoteIndex = dayNumber % quotes.length`
- This logic should live in a small pure function, e.g. `getDailyQuote(date = new Date())`, so it's testable and reusable (e.g. could later be reused for daily-rotating wallpaper or similar).

### 4.3 Rendering
- Add a new DOM element (e.g. `<p id="daily-quote">`) into the existing dashboard layout, inside the same container as the focus message.
- On dashboard load: call `getDailyQuote()`, set `textContent` of the quote element.
- No storage read/write needed for the quote itself — it's derived purely from the date, not persisted state. (Contrast with focus prompt text, which IS persisted.)

### 4.4 Styling
- Smaller font-size than the focus message (e.g. 70–80% of it).
- Reduced opacity or a muted color so it doesn't visually compete with the focus prompt.
- Should not push the task list down enough to cause layout shift/crowding — verify on a small viewport (e.g. 1280×720).
- Should respect existing wallpaper contrast handling (if the dashboard already has text-shadow/overlay for legibility over wallpapers, the quote must use the same treatment).

### 4.5 No new permissions
- This feature requires no manifest changes, no new permissions, no new storage keys. Flag explicitly if any implementation deviates from this.

---

## 5. Out of Scope (do not build)

- Settings UI to add/edit/remove quotes
- Random (non-deterministic) quote selection
- Fetching quotes from an external API
- Per-user quote history/favorites
- Different quote categories or tags

---

## 6. Build Phases

### Phase 1 — Data layer
- Create `quotes.js` with a hardcoded array of 40 motivational quotes (no duplicates, no attribution needed unless trivially short).
- Implement `getDailyQuote(date = new Date())` pure function with day-number + modulo logic.
- **Deliverable:** a function that, given any JS `Date`, deterministically returns one quote string. Should be manually verifiable (e.g. console.log for several dates) before touching the UI.

### Phase 2 — UI integration
- Add the `<p id="daily-quote">` element to the dashboard HTML, placed directly below the focus message element.
- On dashboard init script, call `getDailyQuote()` and inject text.
- **Deliverable:** quote visibly renders below the focus message on a fresh new tab load.

### Phase 3 — Styling pass
- Apply secondary/muted styling (font-size, color/opacity, spacing) so it reads as a supporting element, not competing with the focus message.
- Test against at least one light wallpaper and one dark wallpaper for legibility.
- Test at a small window size to confirm no crowding or overlap with the task list.
- **Deliverable:** clean layout, confirmed on two wallpapers and one small viewport.

### Phase 4 — Day-rollover verification
- Manually test the day-boundary behavior: temporarily mock or override the date passed into `getDailyQuote()` with two different calendar days and confirm two different quotes appear.
- Confirm reopening multiple new tabs on the same day always shows the same quote (no randomness, no flicker).
- **Deliverable:** confirmed deterministic, stable-per-day behavior with no persisted storage required.

### Phase 5 — Cleanup
- Remove any temporary date-mocking/debug code from Phase 4.
- Confirm no console errors, no new permissions added, no manifest changes.
- **Deliverable:** feature complete, ready for commit.

---

## 7. Success Criteria (acceptance)

- [ ] A quote appears on the dashboard, below the focus message.
- [ ] The same quote persists across multiple tab opens within the same calendar day.
- [ ] The quote changes automatically the next calendar day, with no user action required.
- [ ] After the quote list is exhausted, the rotation loops back to the first quote rather than breaking.
- [ ] Layout remains clean: no overlap or crowding of the task list, focus message, or clock.
- [ ] No new Chrome permissions or manifest changes were introduced.
