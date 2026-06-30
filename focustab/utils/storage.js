const DEFAULTS = {
  user_name: '',
  wallpaper: '',
  focus: {},
  tasks: [],
  focus_mode: false,
  blocked_sites: ['instagram.com', 'youtube.com', 'linkedin.com', 'twitter.com', 'reddit.com'],
  journal_entries: [],
  streak: 0,
};

export function getStorage(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, resolve);
  });
}

export function setStorage(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, resolve);
  });
}

export async function initStorage() {
  const existing = await getStorage(Object.keys(DEFAULTS));
  const updates = {};
  for (const [key, defaultValue] of Object.entries(DEFAULTS)) {
    if (existing[key] === undefined) {
      updates[key] = defaultValue;
    }
  }
  if (Object.keys(updates).length > 0) {
    await setStorage(updates);
  }
}
