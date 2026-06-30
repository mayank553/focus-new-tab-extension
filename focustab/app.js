import { getStorage, setStorage, initStorage } from './utils/storage.js';
import { getTodayString, getTimeOfDay, isPastEightPM } from './utils/date.js';
import { calculateStreak } from './utils/streak.js';
import { getDailyQuote } from './features/feature1-daily-quote/quotes.js';

// ── Wallpaper ───────────────────────────────────────────────────────────────
async function initWallpaper() {
  const { wallpaper } = await getStorage(['wallpaper']);
  if (wallpaper) {
    document.getElementById('wallpaper').style.backgroundImage = `url(${wallpaper})`;
  }
  // No-op when empty: CSS already points to assets/default-wallpaper.svg
}

// ── Greeting ────────────────────────────────────────────────────────────────
async function initGreeting() {
  const { user_name } = await getStorage(['user_name']);
  renderGreeting(user_name);
}

function renderGreeting(name) {
  const tod = getTimeOfDay();
  const label = tod[0].toUpperCase() + tod.slice(1);
  document.getElementById('greeting').textContent = `Good ${label}, ${name || 'Friend'}`;
}

// ── Clock ────────────────────────────────────────────────────────────────────
let _lastDate = getTodayString();

function tickClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  document.getElementById('clock-time').textContent = `${hh} • ${mm} • ${ss}`;
  document.getElementById('clock-date').textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const today = getTodayString();
  if (today !== _lastDate) {
    _lastDate = today;
    handleDateChange();
  }
}

async function handleDateChange() {
  const { user_name } = await getStorage(['user_name']);
  renderGreeting(user_name);
  showFocusPrompt();
}

// ── Daily Focus ──────────────────────────────────────────────────────────────
async function initFocus() {
  const { focus } = await getStorage(['focus']);
  if (focus?.date === getTodayString() && focus.focus) {
    showFocusText(focus.focus);
  } else {
    showFocusPrompt();
  }
}

function showFocusText(text) {
  document.getElementById('focus-text').textContent = text;
  document.getElementById('focus-display').classList.remove('hidden');
  document.getElementById('focus-prompt').classList.add('hidden');
}

function showFocusPrompt() {
  document.getElementById('focus-display').classList.add('hidden');
  document.getElementById('focus-prompt').classList.remove('hidden');
  document.getElementById('focus-input').value = '';
}

// ── Streak ────────────────────────────────────────────────────────────────────
async function renderStreak() {
  const { journal_entries } = await getStorage(['journal_entries']);
  const count = calculateStreak(journal_entries || []);
  const el = document.getElementById('streak-display');
  if (count > 0) {
    el.textContent = `${count} Day Streak 🔥`;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

// ── Reflection Modal ──────────────────────────────────────────────────────────
function showModal() {
  document.getElementById('reflection-overlay').classList.add('modal-open');
}

function hideModal() {
  document.getElementById('reflection-overlay').classList.remove('modal-open');
  document.getElementById('reflection-input').value = '';
}

async function initReflection() {
  if (!isPastEightPM()) return;
  const { journal_entries } = await getStorage(['journal_entries']);
  const today = getTodayString();
  const alreadySaved = (journal_entries || []).some((e) => e.date === today);
  if (!alreadySaved) showModal();
}

// ── Daily Quote ──────────────────────────────────────────────────────────────
function initDailyQuote() {
  document.getElementById('daily-quote').textContent = getDailyQuote(new Date());
}

// ── Focus Mode Toggle ────────────────────────────────────────────────────────
async function initFocusMode() {
  const { focus_mode } = await getStorage(['focus_mode']);
  document.getElementById('focus-mode-toggle').checked = !!focus_mode;
}

// ── Task Manager ─────────────────────────────────────────────────────────────
async function renderTasks() {
  const { tasks } = await getStorage(['tasks']);
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  (tasks || []).forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = task.completed;
    cb.addEventListener('change', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const del = document.createElement('button');
    del.className = 'task-delete';
    del.textContent = '×';
    del.setAttribute('aria-label', 'Delete task');
    del.addEventListener('click', () => deleteTask(task.id));

    li.append(cb, span, del);
    list.appendChild(li);
  });
}

async function addTask(text) {
  const { tasks } = await getStorage(['tasks']);
  const updated = [...(tasks || []), { id: crypto.randomUUID(), text, completed: false }];
  await setStorage({ tasks: updated });
  await renderTasks();
}

async function toggleTask(id) {
  const { tasks } = await getStorage(['tasks']);
  const updated = (tasks || []).map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
  await setStorage({ tasks: updated });
  await renderTasks();
}

async function deleteTask(id) {
  const { tasks } = await getStorage(['tasks']);
  const updated = (tasks || []).filter((t) => t.id !== id);
  await setStorage({ tasks: updated });
  await renderTasks();
}

// ── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  await initStorage();
  initDailyQuote();
  await Promise.all([initWallpaper(), initGreeting(), initFocus(), renderTasks(), initFocusMode(), renderStreak(), initReflection()]);

  document.getElementById('focus-input').addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    const text = e.target.value.trim();
    if (!text) return;
    await setStorage({ focus: { focus: text, date: getTodayString() } });
    showFocusText(text);
  });

  document.getElementById('reflection-save').addEventListener('click', async () => {
    const win = document.getElementById('reflection-input').value.trim();
    const { journal_entries } = await getStorage(['journal_entries']);
    const updated = [...(journal_entries || []), { date: getTodayString(), win }];
    await setStorage({ journal_entries: updated });
    hideModal();
    await renderStreak();
  });

  document.getElementById('reflection-skip').addEventListener('click', hideModal);

  document.getElementById('focus-mode-toggle').addEventListener('change', async (e) => {
    await setStorage({ focus_mode: e.target.checked });
  });

  document.getElementById('focus-edit-btn').addEventListener('click', async () => {
    const { focus } = await getStorage(['focus']);
    const currentText = focus?.focus || '';
    document.getElementById('focus-input').value = currentText;
    showFocusPrompt();
    document.getElementById('focus-input').focus();
  });

  document.getElementById('focus-delete-btn').addEventListener('click', async () => {
    await setStorage({ focus: null });
    showFocusPrompt();
  });

  document.getElementById('task-input').addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    const text = e.target.value.trim();
    if (!text) return;
    e.target.value = '';
    await addTask(text);
  });

  tickClock();
  setInterval(tickClock, 1000);
}

document.addEventListener('DOMContentLoaded', init);
