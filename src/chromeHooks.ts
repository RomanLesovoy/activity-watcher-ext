import { execTimeLimitCheck } from './limits';
import { TimeData } from './types';
import { syncMostData } from './statistics';
import { storageType } from './constants';

let currentUrl: string | null = null;
let startTime: number | null = null;
let timeData: TimeData = {};

 /**
 * Update time spent on current url when tab is activated
 */
 chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  onTabHandle(tab);
});

/**
 * Update time spent on current url when tab is updated
 */
chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    onTabHandle(tab);
  }
});

/**
 * Handle window focus change
 */
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Lost focus
    currentUrl = null;
  } else {
    // Window gained focus
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    if (tabs[0] && tabs[0].id && tabs[0].url) {
      onTabHandle(tabs[0]);
    }
  }
});

/**
 * Handle tab update
 */
function onTabHandle(tab: chrome.tabs.Tab) {
  tab.url && (currentUrl = new URL(tab.url).hostname);
  startTime = Date.now();
  if (currentUrl) {
    updateTimeForCurrentUrl();
    timeData[currentUrl] && execTimeLimitCheck(currentUrl, tab, timeData);
  }
}

/**
 * Update time spent on current url
 */
function updateTimeForCurrentUrl() {
  if (currentUrl && startTime) {
    const timeSpent = Date.now() - startTime;
    timeData[currentUrl] = (timeData[currentUrl] || 0) + timeSpent;
    startTime = Date.now();
    chrome.storage[storageType].set({ timeData });
  }
}
setInterval(updateTimeForCurrentUrl, 10000);

/**
 * Sync most visited data with popup on install
 */
chrome.runtime.onInstalled.addListener(() => {
  syncMostData();
});
setInterval(syncMostData, 60000);
