function getStorageValues(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

async function updateBlockingRules(isEnabled, blockedSites) {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map((r) => r.id);

  if (!isEnabled || !blockedSites || blockedSites.length === 0) {
    if (removeRuleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds });
    }
    return;
  }

  const addRules = blockedSites.map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: { extensionPath: '/block.html' },
    },
    condition: {
      urlFilter: `||${domain}^`,
      resourceTypes: ['main_frame'],
    },
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
}

chrome.storage.onChanged.addListener((changes) => {
  if ('focus_mode' in changes || 'blocked_sites' in changes) {
    getStorageValues(['focus_mode', 'blocked_sites']).then(({ focus_mode, blocked_sites }) => {
      updateBlockingRules(focus_mode ?? false, blocked_sites ?? []);
    });
  }
});

// Apply rules on service worker startup
getStorageValues(['focus_mode', 'blocked_sites']).then(({ focus_mode, blocked_sites }) => {
  updateBlockingRules(focus_mode ?? false, blocked_sites ?? []);
});
