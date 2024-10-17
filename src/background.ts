interface TimeData {
  [url: string]: number;
}

let currentUrl: string | null = null;
let startTime: number | null = null;
let timeData: TimeData = {};

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  tab.url && (currentUrl = new URL(tab.url).hostname);
  startTime = Date.now();
  updateTimeForCurrentUrl();
});

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    tab.url && (currentUrl = new URL(tab.url).hostname);
    startTime = Date.now();
    updateTimeForCurrentUrl();
  }
});

function updateTimeForCurrentUrl() {
  if (currentUrl && startTime) {
    const timeSpent = Date.now() - startTime;
    timeData[currentUrl] = (timeData[currentUrl] || 0) + timeSpent;
    startTime = Date.now();
    chrome.storage.local.set({ timeData });
  }
}

setInterval(updateTimeForCurrentUrl, 10000);
