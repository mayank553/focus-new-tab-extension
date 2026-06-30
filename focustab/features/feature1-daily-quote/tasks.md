# Feature 1 — Daily Motivational Quote: Development Tasks

Derived from: `Feature1PRD-daily-motivational-quote.md`
Scope: V1 only. No external APIs, no Settings UI, no new manifest permissions.
Phases are ordered by dependency. Complete each phase before starting the next.

---

## Phase 1 — Data Layer
> Build and verify the pure data logic before touching any UI.

- [x] F1-P1-1: Create `focustab/features/feature1-daily-quote/quotes.js`
  - Export a `const quotes` array of exactly 40 motivational strings
  - Each quote must be <= 120 characters
  - No duplicate quotes
  - No attribution required unless quote is trivially short
- [x] F1-P1-2: Implement `getDailyQuote(date = new Date())` pure function in `quotes.js`
  - Compute a stable "day number" using **local date** (not UTC) since a fixed epoch (e.g. `2024-01-01`)
  - Formula: `quoteIndex = dayNumber % quotes.length`
  - Return the quote string at that index
  - Export the function as a named export
- [x] F1-P1-3: Manual smoke-test (console) — call `getDailyQuote()` with at least 3 different hardcoded dates
  - Confirm different dates return different quotes
  - Confirm the same date always returns the same quote
  - Confirm no crash when `dayNumber > quotes.length` (looping works)

---

## Phase 2 — UI Integration
> Depends on: Phase 1 (function must exist and be verified before wiring into the DOM)

- [x] F1-P2-1: Add `<p id="daily-quote"></p>` to `newtab.html`
  - Place it directly below the `#focus-card` element (inside `<main class="center">`)
- [x] F1-P2-2: Import `getDailyQuote` into `app.js`
  - Add import line at the top alongside existing utils imports
- [x] F1-P2-3: Create `initDailyQuote()` function in `app.js`
  - Call `getDailyQuote()` with `new Date()`
  - Set `document.getElementById('daily-quote').textContent` to the returned string
- [x] F1-P2-4: Call `initDailyQuote()` inside `init()` in `app.js`
  - Add to the existing `Promise.all([...])` call so it initialises alongside other modules
- [x] F1-P2-5: Verify quote renders visibly below the focus message on a fresh new tab load

---

## Phase 3 — Styling
> Depends on: Phase 2 (element must exist in DOM before styling)

- [x] F1-P3-1: Add `#daily-quote` styles to `styles.css`
  - Font-size: 70-80% of `#focus-text` font-size (e.g. `0.85rem`)
  - Opacity or muted color so it reads as secondary, not competing with focus message
  - Add top margin/spacing to visually separate it from the focus card
  - Ensure it inherits or explicitly sets `text-align: center`
- [x] F1-P3-2: Verify no layout crowding on a 1280x720 viewport
  - Quote must not push the task list panel off-screen or cause overflow
- [x] F1-P3-3: Test legibility against a light wallpaper
  - Quote text must remain readable
- [x] F1-P3-4: Test legibility against a dark wallpaper
  - Quote text must remain readable

---

## Phase 4 — Day-Rollover Verification
> Depends on: Phase 2 and Phase 3 complete

- [x] F1-P4-1: Temporarily pass a hardcoded `Date` into `getDailyQuote()` in `app.js` (debug only)
  - Use two different calendar dates and confirm two different quotes render in the UI
- [x] F1-P4-2: Open multiple new tabs on the same calendar day
  - Confirm the same quote appears every time (no randomness, no flicker)
- [x] F1-P4-3: Confirm quote changes when the date changes
  - Use a mocked date one day ahead and verify a different quote appears

---

## Phase 5 — Cleanup & Acceptance
> Depends on: All phases above complete. No debug code must remain.

- [x] F1-P5-1: Remove any temporary date-mocking or `console.log` debug code from `app.js`
- [x] F1-P5-2: Confirm no `console.error` or `console.warn` messages appear on new tab load
- [x] F1-P5-3: Confirm `manifest.json` is unchanged (no new permissions added)
- [x] F1-P5-4: Confirm no `chrome.storage` reads/writes were added for the quote (derived from date only)
- [x] F1-P5-5: Run through all PRD acceptance criteria:
  - [x] A quote appears on the dashboard, below the focus message
  - [x] The same quote persists across multiple tab opens within the same calendar day
  - [x] The quote changes automatically the next calendar day, with no user action required
  - [x] After the quote list is exhausted, the rotation loops back to the first quote rather than breaking
  - [x] Layout remains clean: no overlap or crowding of the task list, focus message, or clock
  - [x] No new Chrome permissions or manifest changes were introduced

---

## File Checklist

| File | Action | Notes |
|---|---|---|
| `focustab/features/feature1-daily-quote/quotes.js` | **CREATE** | 40 quotes + `getDailyQuote()` |
| `focustab/newtab.html` | **MODIFY** | Add `<p id="daily-quote">` below `#focus-card` |
| `focustab/app.js` | **MODIFY** | Import + `initDailyQuote()` + call in `init()` |
| `focustab/styles.css` | **MODIFY** | Add `#daily-quote` styles |
| `focustab/manifest.json` | **DO NOT TOUCH** | No new permissions needed |
| `focustab/utils/storage.js` | **DO NOT TOUCH** | No storage needed for quote |

---

## Dependency Map

```
Phase 1 (Data — quotes.js + getDailyQuote)
    └── Phase 2 (UI Integration — DOM element + app.js wiring)
            └── Phase 3 (Styling — styles.css)
                    └── Phase 4 (Day-Rollover Verification)
                                └── Phase 5 (Cleanup & Acceptance)
```
