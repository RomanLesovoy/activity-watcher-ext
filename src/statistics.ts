import { KEY_ALL, KEY_MOST, MOST_AMOUNT, storageType } from './constants';
import { TimeData } from './types';

/**
 * Get most visited sites
 */
export async function getMostVisited(): Promise<TimeData> {
  return (await chrome.storage[storageType].get([KEY_MOST]) || {})[KEY_MOST];
}

/**
 * Get all time data
 */
export async function getAllData(): Promise<TimeData> {
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

export async function cleanupStatistics(statistics: Record<string, number>) {
  const entries = Object.entries(statistics);
  if (entries.length > 50) {
    const sortedEntries = entries.sort(([, a], [, b]) => a - b);
    const entriesToKeep = sortedEntries.slice(0, 30);
    return Object.fromEntries(entriesToKeep);
  }
  return statistics;
}
