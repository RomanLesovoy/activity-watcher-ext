import { KEY_ALL, KEY_MOST, MOST_AMOUNT, storageType } from './constants';
import { TimeDataAll, TimeDataMost } from './types';

/**
 * Get most visited sites
 */
export async function getMostVisited(): Promise<TimeDataMost> {
  return (await chrome.storage[storageType].get([KEY_MOST]) || {})[KEY_MOST];
}

/**
 * Get all time data
 */
export async function getAllData(): Promise<TimeDataAll> {
  return (await chrome.storage[storageType].get([KEY_ALL]) || {})[KEY_ALL];
}

/**
 * Sync most visited data with popup
 */
export async function syncMostData() {
  const allData = (await getAllData() || {});
  const mostVisited = Object.entries(allData || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, MOST_AMOUNT);
  chrome.storage[storageType].set({ [KEY_MOST]: Object.fromEntries(mostVisited) });
}
