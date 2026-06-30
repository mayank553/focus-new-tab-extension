function get(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

function set(data) {
  return new Promise((resolve) => chrome.storage.local.set(data, resolve));
}

// ── Wallpaper ─────────────────────────────────────────────────────────────────
async function initWallpaper() {
  const { wallpaper } = await get(['wallpaper']);
  if (wallpaper) {
    applyWallpaper(wallpaper);
  }
}

function applyWallpaper(dataUrl) {
  document.getElementById('wallpaper').style.backgroundImage = `url(${dataUrl})`;
}

// ── Name ──────────────────────────────────────────────────────────────────────
async function initName() {
  const { user_name } = await get(['user_name']);
  document.getElementById('name-input').value = user_name || '';
}

function showNameConfirm(msg) {
  const el = document.getElementById('name-confirm');
  el.textContent = msg;
  setTimeout(() => { el.textContent = ''; }, 2500);
}

// ── Block list ────────────────────────────────────────────────────────────────
async function renderBlockList() {
  const { blocked_sites } = await get(['blocked_sites']);
  const list = document.getElementById('blocked-list');
  list.innerHTML = '';

  (blocked_sites || []).forEach((domain) => {
    const li = document.createElement('li');
    li.className = 'blocked-item';

    const span = document.createElement('span');
    span.textContent = domain;

    const btn = document.createElement('button');
    btn.className = 'remove-btn';
    btn.textContent = '×';
    btn.setAttribute('aria-label', `Remove ${domain}`);
    btn.addEventListener('click', () => removeDomain(domain));

    li.append(span, btn);
    list.appendChild(li);
  });
}

async function addDomain(domain) {
  const { blocked_sites } = await get(['blocked_sites']);
  const sites = blocked_sites || [];
  if (sites.includes(domain)) return;
  await set({ blocked_sites: [...sites, domain] });
  await renderBlockList();
}

async function removeDomain(domain) {
  const { blocked_sites } = await get(['blocked_sites']);
  await set({ blocked_sites: (blocked_sites || []).filter((d) => d !== domain) });
  await renderBlockList();
}

function isValidDomain(value) {
  return /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(value);
}

// ── Reflection History (P6-9) ─────────────────────────────────────────────────
async function renderReflectionHistory() {
  const { journal_entries } = await get(['journal_entries']);
  const list = document.getElementById('history-list');
  list.innerHTML = '';

  const entries = (journal_entries || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));

  if (entries.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty-msg';
    p.textContent = 'No reflections saved yet.';
    list.appendChild(p);
    return;
  }

  entries.forEach(({ date, win }) => {
    const li = document.createElement('li');
    li.className = 'history-item';

    const dateEl = document.createElement('p');
    dateEl.className = 'history-date';
    dateEl.textContent = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const winEl = document.createElement('p');
    winEl.className = 'history-win';
    winEl.textContent = win || '—';

    li.append(dateEl, winEl);
    list.appendChild(li);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  await Promise.all([initWallpaper(), initName(), renderBlockList(), renderReflectionHistory()]);

  // Name save
  document.getElementById('name-save').addEventListener('click', async () => {
    const value = document.getElementById('name-input').value.trim();
    if (!value) { showNameConfirm('Name cannot be empty.'); return; }
    await set({ user_name: value });
    showNameConfirm('Saved!');
  });

  // Wallpaper file picker
  document.getElementById('wallpaper-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('wallpaper-name').textContent = file.name;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      await set({ wallpaper: dataUrl });
      applyWallpaper(dataUrl);
      document.getElementById('wallpaper-confirm').textContent = 'Wallpaper updated!';
      setTimeout(() => { document.getElementById('wallpaper-confirm').textContent = ''; }, 2500);
    };
    reader.readAsDataURL(file);
  });

  // Domain add
  document.getElementById('domain-add').addEventListener('click', async () => {
    const raw = document.getElementById('domain-input').value.trim().toLowerCase();
    const errorEl = document.getElementById('domain-error');

    if (!raw) { errorEl.textContent = 'Enter a domain.'; return; }
    if (!isValidDomain(raw)) { errorEl.textContent = 'Enter a valid domain (e.g. example.com).'; return; }

    errorEl.textContent = '';
    document.getElementById('domain-input').value = '';
    await addDomain(raw);
  });

  document.getElementById('domain-input').addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') document.getElementById('domain-add').click();
  });
}

document.addEventListener('DOMContentLoaded', init);
