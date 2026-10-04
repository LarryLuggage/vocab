// Lexis Engine — Options Page Script

const DEFAULT_API_URL = 'http://localhost:3000';
const DEFAULT_API_TOKEN = 'lexis-personal-secret-2026';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('settings-form');
  const apiUrlInput = document.getElementById('api-url');
  const apiTokenInput = document.getElementById('api-token');
  const testBtn = document.getElementById('test-btn');
  const statusMsg = document.getElementById('status-msg');

  // Load saved settings
  const settings = await chrome.storage.sync.get({
    apiUrl: DEFAULT_API_URL,
    apiToken: DEFAULT_API_TOKEN,
  });

  apiUrlInput.value = settings.apiUrl;
  apiTokenInput.value = settings.apiToken;

  function showStatus(text, type) {
    statusMsg.className = type;
    statusMsg.style.display = 'block';
    statusMsg.textContent = text;
  }

  // Save Settings
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cleanUrl = apiUrlInput.value.trim().replace(/\/+$/, '');
    const cleanToken = apiTokenInput.value.trim();

    await chrome.storage.sync.set({
      apiUrl: cleanUrl,
      apiToken: cleanToken,
    });

    showStatus('✓ Settings successfully saved to your browser.', 'success');
    setTimeout(() => {
      statusMsg.style.display = 'none';
    }, 4000);
  });

  // Test Connection
  testBtn.addEventListener('click', async () => {
    const cleanUrl = apiUrlInput.value.trim().replace(/\/+$/, '');
    const cleanToken = apiTokenInput.value.trim();

    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';
    statusMsg.style.display = 'none';

    try {
      const response = await fetch(`${cleanUrl}/api/cards`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (response.ok) {
        showStatus(`✓ Connection successful! Connected to ${cleanUrl}.`, 'success');
      } else {
        showStatus(`Warning: Server reached but returned HTTP status ${response.status}.`, 'error');
      }
    } catch (err) {
      showStatus(
        `Failed to connect to ${cleanUrl}. Check network or ensure server is active.`,
        'error'
      );
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = 'Test Connection';
    }
  });
});
