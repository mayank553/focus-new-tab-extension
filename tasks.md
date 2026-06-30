# FocusTab — Development Tasks

Phases are ordered by dependency. Complete each phase before starting the next.
Tasks within a phase can be worked in parallel unless noted.

---

## Phase 0 — Project Scaffolding
> Prerequisite for everything. No code can be written until this is done.

- [x] P0-1: Create `/focustab` root folder
- [x] P0-2: Create `/focustab/assets/` folder (for default wallpaper image)
- [x] P0-3: Create `/focustab/utils/` folder
- [x] P0-4: Add a default wallpaper image to `assets/` (bundled with extension)
- [x] P0-5: Create `manifest.json` with Manifest V3 declaration
  - Set `manifest_version: 3`
  - Set `name`, `version`, `description`
  - Declare `chrome_url_overrides.newtab` → `newtab.html`
  - Declare `permissions`: `storage`, `tabs`, `declarativeNetRequest`
  - Declare `background.service_worker` → `background.js`
  - Declare `web_accessible_resources` for `block.html`

---

## Phase 1 — Storage & Utilities
> All feature modules read/write storage. Build this before any feature logic.

- [x] P1-1: Create `utils/storage.js`
  - Export `getStorage(keys)` wrapper around `chrome.storage.local.get`
  - Export `setStorage(data)` wrapper around `chrome.storage.local.set`
  - Initialize defaults on first install: `user_name`, `wallpaper`, `focus`, `tasks`, `focus_mode`, `blocked_sites`, `journal_entries`, `streak`
- [x] P1-2: Create `utils/date.js`
  - Export `getTodayString()` → returns `YYYY-MM-DD`
  - Export `getTimeOfDay()` → returns `"morning"`, `"afternoon"`, `"evening"`, or `"night"` based on hour
  - Export `isPastEightPM()` → returns boolean
- [x] P1-3: Create `utils/streak.js`
  - Export `calculateStreak(journalEntries)` → returns current streak count
  - Counts consecutive days with journal entries going backwards from today/yesterday
  - Focus-was-set check enforced upstream at reflection save time

---

## Phase 2 — Dashboard UI
> Depends on: Phase 0, Phase 1

### 2a — HTML & Base Styles (do first, rest depend on this)
- [x] P2-1: Create `newtab.html` with semantic structure
  - Top region: greeting container
  - Center region: clock container, daily focus container
  - Bottom-left region: task list container
  - Bottom-right region: focus mode toggle, settings icon
  - Popup region: reflection modal placeholder (hidden)
- [x] P2-2: Create `styles.css` with glassmorphism base
  - Full-viewport background layer for wallpaper
  - Glassmorphism card style (backdrop-filter blur, semi-transparent white border)
  - White text, soft shadows
  - Smooth transitions on specific properties
  - Minimal icon sizing and spacing
  - 3-row CSS Grid layout (greeting / center / bottom-row)

### 2b — Wallpaper
- [x] P2-3: Implement wallpaper rendering in `app.js`
  - On load, read `wallpaper` from storage
  - If exists: set as CSS `background-image` on body
  - If missing: fall back to `assets/default-wallpaper.svg` (handled by CSS default)

### 2c — Greeting
- [x] P2-4: Implement personalized greeting
  - Read `user_name` from storage (fallback: `"Friend"`)
  - Call `getTimeOfDay()` from `utils/date.js`
  - Render: `Good [Morning/Afternoon/Evening/Night], {name}`
  - Update greeting text on clock tick in case day transitions

### 2d — Live Clock
- [x] P2-5: Implement live clock display
  - Show hours, minutes, seconds, and current date
  - Use `setInterval` at 1000ms to update every second
  - Format date as human-readable (e.g., `Sunday, June 29`)

### 2e — Daily Focus
- [x] P2-6: Implement daily focus prompt logic
  - On load, read `focus` from storage
  - Compare stored `focus.date` with `getTodayString()`
  - If date matches: display stored `focus.focus` text (skip prompt)
  - If date differs or no focus: show input prompt `"What is your main focus today?"`
- [x] P2-7: Implement focus save on Enter key
  - Validate input is not empty
  - Save `{ focus: "<text>", date: "YYYY-MM-DD" }` to storage
  - Hide input, show focus text on dashboard
- [x] P2-8: Implement focus auto-reset on date change (edge case)
  - On each clock tick, compare stored focus date with today
  - If date changed: clear displayed focus, show prompt again

### 2f — App Init
- [x] P2-9: Create `app.js` entry point
  - Call all init functions in correct order on `DOMContentLoaded`
  - Wire up all event listeners

---

## Phase 3 — Task Manager
> Depends on: Phase 2 (dashboard HTML structure must exist)

- [x] P3-1: Add task input field and task list container to `newtab.html`
- [x] P3-2: Style task section in `styles.css` (glassmorphism card, checkbox, strikethrough, trash icon)
- [x] P3-3: Implement task list render function in `app.js`
  - Read `tasks` array from storage
  - For each task, render: checkbox, text span, delete button
  - Apply `.completed` class (strikethrough) if `task.completed === true`
- [x] P3-4: Implement add task on Enter key
  - Validate input is not empty (prevent blank tasks)
  - Generate UUID for `task.id` (use `crypto.randomUUID()`)
  - Append `{ id, text, completed: false }` to tasks array in storage
  - Re-render task list
- [x] P3-5: Implement checkbox toggle (mark complete)
  - On checkbox click, find task by `id` in storage array
  - Flip `completed` boolean
  - Save updated array to storage
  - Re-render task list
- [x] P3-6: Implement delete task
  - On trash icon click, remove task by `id` from storage array
  - Save updated array to storage
  - Re-render task list

---

## Phase 4 — Focus Mode (Website Blocker)
> Depends on: Phase 1 (storage), Phase 0 (manifest declarativeNetRequest setup)

### 4a — Block Page (no JS dependencies, build first)
- [x] P4-1: Create `block.html`
  - Display `"Stay Focused"` heading
  - Display `"Your main focus today: {daily_focus}"` (or generic if none set)
  - Add `"Go Back"` button
  - Add `"Disable Focus Mode"` button
- [x] P4-2: Create `block.js`
  - On load, read `focus` from storage; inject focus text into page
  - If no focus set: show `"Stay on track"` as fallback
  - `"Go Back"` button: calls `history.back()`
  - `"Disable Focus Mode"` button: sets `focus_mode: false` in storage, then calls `history.back()`

### 4b — Background Service Worker
- [x] P4-3: Create `background.js`
  - Export `updateBlockingRules(isEnabled, blockedSites)` function
  - When enabled: use `chrome.declarativeNetRequest.updateDynamicRules` to add redirect rules for each domain → `block.html`
  - When disabled: remove all dynamic rules
  - Listen for `chrome.storage.onChanged` for `focus_mode` and `blocked_sites` changes; call `updateBlockingRules` accordingly
  - On service worker startup, read current `focus_mode` and `blocked_sites` and apply rules

### 4c — Dashboard Toggle
- [x] P4-4: Add focus mode toggle switch to `newtab.html`
- [x] P4-5: Style toggle switch in `styles.css`
- [x] P4-6: Implement toggle behavior in `app.js`
  - On load, read `focus_mode` state; set toggle UI accordingly
  - On toggle change: save new `focus_mode` boolean to storage
  - Background script picks up the change via `onChanged` listener

### 4d — Default Block List Init
- [x] P4-7: In `utils/storage.js` default init, set `blocked_sites` to `["instagram.com", "youtube.com", "linkedin.com", "twitter.com", "reddit.com"]`

---

## Phase 5 — Settings Page
> Depends on: Phase 2 (greeting uses name), Phase 4 (block list used by blocker)

- [x] P5-1: Create `settings.html` with sections: Name, Wallpaper, Block List
- [x] P5-2: Create `settings.js` entry point
- [x] P5-3: Add settings icon to `newtab.html` (bottom-right) linking to `settings.html`

### 5a — Name Setting
- [x] P5-4: Render current `user_name` in name input field on settings load
- [x] P5-5: On Save button click: validate non-empty, save `user_name` to storage, show confirmation

### 5b — Wallpaper Upload
- [x] P5-6: Add file input (accept image types only) to settings
- [x] P5-7: On file select: use `FileReader` to convert image to base64 string
- [x] P5-8: Save base64 string to `wallpaper` key in storage
- [x] P5-9: Preview new wallpaper immediately in settings page background

### 5c — Block List Management
- [x] P5-10: Render current `blocked_sites` array as a list with remove buttons
- [x] P5-11: Add domain input + "Add" button
  - Validate non-empty and basic domain format
  - Append to `blocked_sites` array in storage
  - Re-render list
- [x] P5-12: Remove domain on button click
  - Filter domain out of `blocked_sites` array
  - Save to storage
  - Re-render list
  - (Background script auto-updates rules via `onChanged`)

---

## Phase 6 — Daily Reflection & Streak
> Depends on: Phase 2 (daily focus must exist), Phase 1 (streak utils)

### 6a — Reflection Modal
- [x] P6-1: Add reflection modal HTML to `newtab.html` (hidden by default)
  - Heading: `"What did you accomplish today?"`
  - Textarea for response
  - `"Save"` button
  - `"Skip"` button
- [x] P6-2: Style reflection modal in `styles.css` (glassmorphism overlay, centered)

### 6b — Trigger Logic
- [x] P6-3: Implement reflection trigger check in `app.js`
  - Call `isPastEightPM()` from `utils/date.js`
  - Read `journal_entries` from storage
  - If past 8 PM AND no entry for today: show reflection modal
  - If entry already saved for today: do not show modal

### 6c — Save & Skip
- [x] P6-4: Implement Save button
  - Read textarea value (allow empty — edge case: skip still saves a record)
  - Save `{ date: "YYYY-MM-DD", win: "<text>" }` to `journal_entries` array in storage
  - Close modal
  - Trigger streak recalculation
- [x] P6-5: Implement Skip button
  - Close modal without saving (no streak update for today)

### 6d — Streak Engine
- [x] P6-6: Implement streak calculation in `utils/streak.js`
  - Walk backwards from today through `journal_entries` and `focus` history
  - Count consecutive days where both focus was set and reflection was completed
  - Stop count on first missing day → that is the streak number
- [x] P6-7: Display streak on dashboard in `newtab.html` (e.g., `"7 Day Streak 🔥"`)
- [x] P6-8: Update streak display after reflection save and on each page load

### 6e — Reflection History
- [x] P6-9: Add reflection history section to `settings.html`
  - List all `journal_entries` sorted by date descending
  - Show date and win text for each entry

---

## Phase 7 — QA & Polish
> Depends on: All phases complete

### Edge Cases
- [x] P7-1: Test date-change-while-browser-open (focus auto-resets mid-session)
- [x] P7-2: Test missing wallpaper → default image renders without error
- [x] P7-3: Test empty reflection skip → no entry saved, no streak increment
- [x] P7-4: Test Focus Mode ON with no daily focus set → generic message shows on block page
- [x] P7-5: Test streak reset when a day is missed

### Performance
- [x] P7-6: Measure new tab load time → must be under 500ms
- [x] P7-7: Confirm no external API calls anywhere in the codebase
- [x] P7-8: Confirm all data is stored in `chrome.storage.local` only

### UX Polish
- [x] P7-9: Verify all CSS transitions are smooth (no jank on modal open/close, toggle switch)
- [ ] P7-10: Test glassmorphism cards render correctly against both light and dark wallpapers
- [ ] P7-11: Verify settings changes reflect immediately on dashboard without page reload

### Extension Testing
- [ ] P7-12: Load extension as unpacked in `chrome://extensions`
- [ ] P7-13: Open new tab → verify dashboard renders
- [ ] P7-14: Test all 6 features end-to-end in Chrome

---

## Dependency Map

```
Phase 0 (Scaffolding)
    └── Phase 1 (Storage & Utils)
            ├── Phase 2 (Dashboard)
            │       ├── Phase 3 (Tasks)
            │       ├── Phase 4 (Focus Mode)
            │       │       └── Phase 5 (Settings) ──┐
            │       └── Phase 6 (Reflection/Streak) ──┤
            │                                         │
            └─────────────────────────────────────────┘
                                Phase 7 (QA & Polish)
```
