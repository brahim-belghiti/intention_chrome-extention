function render() {
  chrome.storage.local.get({ motivations: [] }, (data) => {
    const list = document.getElementById("list");
    const stats = document.getElementById("stats");
    const entries = data.motivations;

    if (entries.length === 0) {
      stats.textContent = "No motivation logged yet.";
      list.innerHTML = `<div class="empty">🧘 <p>Intentions start with awareness.</p></div>`;
      return;
    }

    const today = new Date().toDateString();
    const todayCount = entries.filter(e => new Date(e.timestamp).toDateString() === today).length;
    stats.textContent = `${entries.length} total · ${todayCount} today`;

    list.innerHTML = [...entries].reverse().map(e => `
      <div class="entry">
        <div class="entry-site">${e.siteName || e.url}</div>
        ${e.mood ? `<div class="entry-mood" style="font-size:12px;color:#888;margin-bottom:2px;">feeling: ${e.mood}</div>` : ""}
        <div class="entry-motivation">“${e.motivation}”</div>
        <div class="entry-time">${new Date(e.timestamp).toLocaleString()}</div>
      </div>
    `).join("");
  });
}

document.getElementById("clear-btn").addEventListener("click", () => {
  if (confirm("Clear all motivation logs?")) {
    chrome.storage.local.set({ motivations: [] }, render);
  }
});

document.getElementById("export-btn").addEventListener("click", () => {
  chrome.storage.local.get({ motivations: [] }, (data) => {
    const rows = data.motivations;
    if (rows.length === 0) return;

    const header = "Timestamp,Site,URL,Mood,Motivation";
    const csv = rows.map(r => {
      const time = new Date(r.timestamp).toISOString();
      const site = `"${(r.siteName || "").replace(/"/g, '""')}"`;
      const url = `"${(r.url || "").replace(/"/g, '""')}"`;
      const mood = `"${(r.mood || "").replace(/"/g, '""')}"`;
      const mot = `"${(r.motivation || "").replace(/"/g, '""')}"`;
      return `${time},${site},${url},${mood},${mot}`;
    }).join("\n");

    const blob = new Blob([header + "\n" + csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `motivations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
});

document.getElementById("settings-btn").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

render();
