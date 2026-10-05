// Lexis Engine — Popup Script

const DEFAULT_API_URL = 'http://localhost:3000';
const DEFAULT_API_TOKEN = ''; // Set your LEXIS_SECRET_TOKEN in the extension options

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('capture-form');
  const termInput = document.getElementById('term');
  const contextInput = document.getElementById('context');
  const sourceInput = document.getElementById('source');
  const submitBtn = document.getElementById('submit-btn');
  const resultBox = document.getElementById('result-box');
  const openOptions = document.getElementById('open-options');
  const openReview = document.getElementById('open-review');
  const openLexicon = document.getElementById('open-lexicon');

  // Load configured settings
  const settings = await chrome.storage.sync.get({
    apiUrl: DEFAULT_API_URL,
    apiToken: DEFAULT_API_TOKEN,
  });

  const baseUrl = settings.apiUrl.replace(/\/+$/, '');

  // Links navigation
  openOptions.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  openReview.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: `${baseUrl}/review` });
  });

  openLexicon.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: `${baseUrl}/lexicon` });
  });

  // Check active tab selection to prefill if present
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const sel = window.getSelection()?.toString().trim();
          return { sel, title: document.title };
        },
      });
      const data = results?.[0]?.result;
      if (data?.sel) {
        termInput.value = data.sel;
      }
      if (data?.title) {
        sourceInput.value = data.title;
      }
    }
  } catch {}

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const term = termInput.value.trim();
    if (!term) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Enriching & Saving...</span>';
    resultBox.style.display = 'none';

    try {
      const response = await fetch(`${baseUrl}/api/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.apiToken}`,
        },
        body: JSON.stringify({
          term,
          contextSentence: contextInput.value.trim() || undefined,
          source: sourceInput.value.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const card = data.card;
        resultBox.className = 'success';
        resultBox.style.display = 'block';
        resultBox.innerHTML = `
          <strong>✓ Saved "${card?.term || term}"</strong>
          <p style="margin-top: 4px; font-style: italic;">${card?.primary_definition || 'Successfully enriched'}</p>
        `;
        termInput.value = '';
        contextInput.value = '';
        termInput.focus();
      } else {
        resultBox.className = 'error';
        resultBox.style.display = 'block';
        resultBox.textContent = data?.error || 'Ingestion failed. Check your token in Settings.';
      }
    } catch (err) {
      resultBox.className = 'error';
      resultBox.style.display = 'block';
      resultBox.textContent = `Could not reach ${baseUrl}. Please ensure the app is running or update your URL in Settings.`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Capture to Personal Lexicon</span>';
    }
  });
});
