import { execTimeLimitCheck } from './limits';
import { getAllData, syncMostData, cleanupStatistics } from './statistics';
import { KEY_ALL, storageType } from './constants';
import { prepareUrl } from './helpers';
let currentUrl: string | null = null;
let startTime: number | null = null;

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

  if (tab.discarded) { // hidden
    currentUrl = null;
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
 * Reset current url when window is removed
 */
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    currentUrl = null;
  }
});

/**
 * Handle tab update
 */
async function onTabHandle(tab: chrome.tabs.Tab) {
  tab.url && (currentUrl = prepareUrl(tab.url));
  startTime = Date.now();
  const statistics = await getAllData();
  if (currentUrl) {
    updateTimeForCurrentUrl();
    statistics[currentUrl] && execTimeLimitCheck(currentUrl, tab, statistics);
  }
}

/**
 * Update time spent on current url
 */
async function updateTimeForCurrentUrl() {
  if (currentUrl && startTime) {
    const timeSpent = Date.now() - startTime;
    const statistics = await getAllData();
    statistics[currentUrl] ? statistics[currentUrl] += timeSpent : statistics[currentUrl] = timeSpent;
    startTime = Date.now();
    
    const cleanedStatistics = await cleanupStatistics(statistics);
    await chrome.storage[storageType].set({ [KEY_ALL]: cleanedStatistics });
  }
}
setInterval(updateTimeForCurrentUrl, 15000);

/**
 * Sync most visited data with popup on install
 */
chrome.runtime.onInstalled.addListener(() => {
  syncMostData();
});
setInterval(syncMostData, 60000);
