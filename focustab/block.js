chrome.storage.local.get(['focus', 'focus_mode'], ({ focus, focus_mode }) => {
  const today = new Date().toISOString().slice(0, 10);
  if (focus?.date === today && focus?.focus) {
    document.getElementById('focus-text').textContent = focus.focus;
  }
});

document.getElementById('btn-back').addEventListener('click', () => {
  history.back();
});

document.getElementById('btn-disable').addEventListener('click', () => {
  chrome.storage.local.set({ focus_mode: false }, () => {
    history.back();
  });
});
