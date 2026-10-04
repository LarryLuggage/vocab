# Zotero & Google Pixel 10 Integration Guide for Lexis Engine

This guide details how to capture vocabulary with full bibliographic context directly from **Zotero** (desktop & mobile) and your **Google Pixel 10**.

---

## 1. Google Pixel 10: Native Android Share Sheet Integration

Lexis Engine implements the **W3C Web Share Target API** in `manifest.json`.

### How to set it up:
1. Open your personal Lexis Engine URL in Chrome on your Pixel 10.
2. Tap the three dots menu (top right) $\rightarrow$ **Install app** (or **Add to Home screen**).
3. Lexis is now registered as a native Android app target in your Pixel's system share menu.

### How to use while reading on your Pixel 10:
1. In **Zotero Android**, **Kindle**, **Chrome**, or any reading app, highlight any word or quote.
2. In the floating Android menu, tap **Share** (or tap the 3 dots $\rightarrow$ Share).
3. Select **Lexis** from your app list.
4. Lexis launches directly on `/add` with the word, sentence, and citation prefilled, automatically parses the Zotero annotation, and enriches it in $\le 2.5\text{s}$.

---

## 2. Desktop Zotero: Smart Citation Auto-Parser

When copying annotations from Zotero's desktop PDF reader, Zotero typically formats the clipboard as:
> `"Her prose was so pellucid that even abstractions were clear..." (Adorno, Negative Dialectics, p. 112)`
> or `"inchoate" (Therborn 2020: 45)`

When you paste this into Lexis (`/add` or the Chrome Extension popup):
- Lexis automatically detects the parentheses and regex-parses:
  - **Word / Clean Quote**: Extracts the target sentence or word.
  - **Author**: Automatically populates `Adorno` or `Therborn`.
  - **Source Title**: Automatically populates `Negative Dialectics`.
  - **Page Number**: Automatically populates `p. 112`.

---

## 3. Desktop Zotero 7: One-Click Quick Action Script

In Zotero 7, you can create a direct hotkey to push your highlighted selection directly to your Lexis cloud endpoint.

### Setup Steps:
1. In Zotero 7, open **Tools** $\rightarrow$ **Developer** $\rightarrow$ **Run JavaScript** (or use the popular free Zotero plugin [Actions & Tags](https://github.com/ windingwind/zotero-actions-tags)).
2. Paste the following script:

```javascript
// Lexis Engine — Zotero 7 Ingest Action
(async () => {
  const LEXIS_URL = 'https://your-lexis-deployment.vercel.app'; // Replace with your live Vercel URL
  const LEXIS_SECRET_TOKEN = 'lexis-personal-secret-2026';     // Replace with your secret token

  const reader = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID);
  if (!reader) {
    alert('Please open a PDF or EPUB in Zotero reader first.');
    return;
  }

  // Extract active selection in reader
  const selectedText = reader.getSelectedText() || '';
  if (!selectedText) {
    alert('Please highlight a word or sentence in the reader.');
    return;
  }

  // Extract active item bibliographic metadata
  const item = Zotero.Items.get(reader.itemID);
  const title = item ? item.getField('title') : '';
  const creators = item ? item.getCreators() : [];
  const author = creators.length > 0 
    ? `${creators[0].firstName || ''} ${creators[0].lastName || ''}`.trim() 
    : '';

  try {
    const response = await Zotero.HTTP.request('POST', `${LEXIS_URL}/api/ingest`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LEXIS_SECRET_TOKEN}`
      },
      body: JSON.stringify({
        term: selectedText.split(/\s+/)[0],
        contextSentence: selectedText,
        source: title,
        author: author
      })
    });

    const data = JSON.parse(response.response);
    if (data.success) {
      alert(`✓ Captured "${data.card?.term || selectedText}" to Lexis!`);
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (err) {
    alert(`Failed to send to Lexis: ${err.message}`);
  }
})();
```

3. Assign this script to a shortcut key in Zotero (e.g. `Ctrl+Alt+L` or `Command+Option+L`). Whenever you are reading a paper in Zotero, simply highlight the sentence and press your hotkey!
