function loadSettings() {
  chrome.storage.local.get({ writingRequired: true }, (data) => {
    document.getElementById("writingRequired").checked = data.writingRequired;
  });
}

function saveSettings() {
  const writingRequired = document.getElementById("writingRequired").checked;
  chrome.storage.local.set({ writingRequired }, () => {
    const msg = document.getElementById("savedMsg");
    msg.classList.add("visible");
    setTimeout(() => msg.classList.remove("visible"), 2000);
  });
}

document.getElementById("writingRequired").addEventListener("change", saveSettings);

loadSettings();
