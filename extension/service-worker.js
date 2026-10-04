// Lexis Engine — Manifest V3 Background Service Worker

const DEFAULT_API_URL = 'http://localhost:3000';
const DEFAULT_API_TOKEN = 'lexis-personal-secret-2026';

// 1. Setup Context Menus on Installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'lexis-capture-selection',
    title: 'Capture "%s" to Lexis',
    contexts: ['selection'],
  });
});

// 2. Handle Context Menu Click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'lexis-capture-selection' && tab?.id) {
    await handleCapture(tab);
  }
});

// 3. Handle Keyboard Shortcut Command (e.g. Alt+L or Command+Shift+L)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'capture-selection') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      await handleCapture(tab);
    }
  }
});

// 4. Capture & Ingestion Handler
async function handleCapture(tab) {
  try {
    setBadge('...', '#78716c');

    // Execute script in active tab to extract selection, surrounding sentence & page metadata
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractSelectedContext,
    });

    const payload = results?.[0]?.result;
    if (!payload || !payload.term) {
      setBadge('!', '#ef4444');
      showNotification('Lexis Capture Error', 'No text was selected.');
      setTimeout(clearBadge, 3000);
      return;
    }

    // Retrieve user settings (URL and Secret Token)
    const settings = await chrome.storage.sync.get({
      apiUrl: DEFAULT_API_URL,
      apiToken: DEFAULT_API_TOKEN,
    });

    const endpoint = `${settings.apiUrl.replace(/\/+$/, '')}/api/ingest`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiToken}`,
      },
      body: JSON.stringify({
        term: payload.term,
        contextSentence: payload.contextSentence,
        source: payload.pageTitle,
        url: payload.pageUrl,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setBadge('✓', '#10b981');
      const card = data.card;
      const def = card?.primary_definition || 'Saved to personal lexicon';
      showNotification(
        `Captured "${card?.term || payload.term}"`,
        `${card?.part_of_speech ? `(${card.part_of_speech}) ` : ''}${def}`
      );
    } else {
      setBadge('!', '#ef4444');
      showNotification('Lexis Ingestion Failed', data?.error || 'Unable to save to Lexis');
    }
  } catch (err) {
    console.error('[Lexis Extension] Error:', err);
    setBadge('!', '#ef4444');
    showNotification('Lexis Error', err?.message || 'Check your extension settings & URL');
  } finally {
    setTimeout(clearBadge, 3500);
  }
}

// In-tab extraction function executed via chrome.scripting
function extractSelectedContext() {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return null;

  const rawSelection = selection.toString().trim();
  if (!rawSelection) return null;

  // Clean word: take first word if multiple words selected, or full phrase
  const words = rawSelection.split(/\s+/);
  const term = words.length <= 3 ? rawSelection : words[0];

  let contextSentence = rawSelection;
  try {
    const node = selection.anchorNode;
    if (node && node.parentElement) {
      const parentText = node.parentElement.innerText || node.textContent || '';
      // Find sentence boundary containing the selection
      const sentences = parentText.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [parentText];
      const match = sentences.find((s) => s.includes(rawSelection));
      if (match) {
        contextSentence = match.trim();
      }
    }
  } catch {}

  return {
    term,
    contextSentence,
    pageTitle: document.title || '',
    pageUrl: window.location.href || '',
  };
}

function setBadge(text, color) {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}

function clearBadge() {
  chrome.action.setBadgeText({ text: '' });
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title,
    message,
    priority: 1,
  });
}
