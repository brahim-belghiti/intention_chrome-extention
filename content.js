const promptedUrls = new Set();
const MIN_CHARS = 25;

function showMotivationModal(url, writingRequired) {
  const existing = document.getElementById("mtv-overlay");
  if (existing) existing.remove();

  const siteName = (() => {
    try { return new URL(url).hostname.replace(/^www\./, ""); }
    catch { return url; }
  })();

  const overlay = document.createElement("div");
  overlay.id = "mtv-overlay";
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.55); z-index: 2147483647;
    display: flex; align-items: center; justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;

  const card = document.createElement("div");
  card.style.cssText = `
    background: #fff; border-radius: 14px; padding: 32px; max-width: 480px;
    width: 90%; box-shadow: 0 25px 80px rgba(0,0,0,0.35);
    text-align: center; animation: mtvFadeIn 0.25s ease-out;
  `;

  card.innerHTML = `
    <style>
      @keyframes mtvFadeIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
    </style>
    <div style="font-size: 44px; margin-bottom: 6px; line-height: 1;">🎯</div>
    <h2 style="margin: 0 0 2px; font-size: 20px; color: #111;">What's your intention?</h2>
    <p style="margin: 0 0 18px; font-size: 14px; color: #666;">
      Why do you want to visit <strong style="color:#333;">${siteName}</strong>?
    </p>
    <input id="mtv-mood" type="text"
      placeholder="What are you feeling? bored, stressed, curious..."
      style="width:100%; padding:12px; border:2px solid #e0e0e0; border-radius:8px;
             font-size:14px; outline:none; box-sizing:border-box; font-family:inherit;
             transition:border 0.15s; color:#222; margin-bottom:10px;">
    <textarea id="mtv-input" rows="3"
      placeholder="Why are you visiting this website? Explain your intention..."
      style="width:100%; padding:12px; border:2px solid #e0e0e0; border-radius:8px;
             font-size:14px; resize:none; outline:none; box-sizing:border-box;
             font-family:inherit; transition:border 0.15s; color:#222;"></textarea>
    <div id="mtv-counter" style="text-align:right; font-size:12px; margin-top:4px; color:#999;">0 / ${MIN_CHARS}</div>
    <div style="display:flex; margin-top:8px;">
      <button id="mtv-submit"
        style="flex:1; padding:10px; border:none; border-radius:8px;
               background:#4a6cf7; color:#fff; font-size:14px; cursor:pointer;
               font-weight:600;">Submit</button>
    </div>
  `;

  overlay.appendChild(card);
  document.documentElement.appendChild(overlay);

  const moodInput = card.querySelector("#mtv-mood");
  const input = card.querySelector("#mtv-input");
  const submitBtn = card.querySelector("#mtv-submit");
  const counter = card.querySelector("#mtv-counter");

  function updateCounter() {
    const len = input.value.length;
    counter.textContent = `${len} / ${MIN_CHARS}`;
    counter.style.color = len >= MIN_CHARS ? "#4a6cf7" : "#999";
    input.style.borderColor = len >= MIN_CHARS ? "#4a6cf7" : "#e0e0e0";
  }

  input.focus();

  function dismiss(motivation) {
    overlay.remove();
    const entry = {
      url,
      siteName,
      mood: moodInput.value.trim(),
      motivation,
      timestamp: new Date().toISOString(),
    };
    chrome.storage.local.get({ motivations: [] }, (data) => {
      data.motivations.push(entry);
      chrome.storage.local.set({ motivations: data.motivations });
    });
  }

  submitBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!writingRequired || text.length >= MIN_CHARS) {
      dismiss(text);
    } else {
      input.style.borderColor = "#e74c3c";
      counter.style.color = "#e74c3c";
    }
  });

  input.addEventListener("input", updateCounter);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitBtn.click();
    }
  });
}

function shouldPrompt(url) {
  if (!url || url.startsWith("chrome://") || url.startsWith("about:") ||
      url.startsWith("chrome-extension://") || url.startsWith("edge://") ||
      url.startsWith("moz-extension://") || url.startsWith("about:")) {
    return false;
  }
  return true;
}

function tryPrompt() {
  const url = location.href;
  if (!shouldPrompt(url)) return;
  if (window.top !== window.self) return;

  const key = url.split("#")[0];
  if (promptedUrls.has(key)) return;
  promptedUrls.add(key);

  chrome.storage.local.get({ writingRequired: true }, (data) => {
    const show = () => setTimeout(() => showMotivationModal(url, data.writingRequired), 200);
    if (document.readyState === "complete" || document.readyState === "interactive") {
      show();
    } else {
      window.addEventListener("load", show);
    }
  });
}

tryPrompt();
