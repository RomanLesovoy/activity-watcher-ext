import { KEY_TIME_LIMITS, storageType } from './constants';
import { TimeData, TimeLimits } from './types';

/**
 * Get time limits
 */
export async function getTimeLimits(): Promise<TimeLimits> {
  return (await chrome.storage[storageType].get([KEY_TIME_LIMITS]))[KEY_TIME_LIMITS];
}

/**
 * Set time limit for a url
 */
export async function setTimeLimit(url: string, hoursSpent: number): Promise<void> {
  const timeLimits = (await getTimeLimits()) || {};
  // @ts-ignore
  timeLimits[url] = hoursSpent;
  chrome.storage[storageType].set({ [KEY_TIME_LIMITS]: timeLimits });
}

/**
 * Check if time limit is reached for a url
 */
export async function checkTimeLimit(url: string, hoursSpent: number): Promise<boolean> {
  const limits = (await getTimeLimits()) || {};
  // @ts-ignore
  const limit: number = limits[url];
  return ifTimeLimitReached(limit, hoursSpent);
}

export function ifTimeLimitReached(limit: number | undefined, hoursSpent: number): boolean {
  return limit ? hoursSpent > limit : false;
}

/**
 * Execute time limit check for a url
 */
export async function execTimeLimitCheck(currentUrl: string, tab: chrome.tabs.Tab, timeData: TimeData) {
  const limitReached = await checkTimeLimit(currentUrl, timeData[currentUrl]);
    if (limitReached) {
      // tab.id && chrome.tabs.remove(tab.id!); // note: this will close the tab, not the window
      chrome.notifications.create({
        type: 'basic',
        title: chrome.i18n.getMessage('timeLimitReachedTitle'),
        message: chrome.i18n.getMessage('timeLimitReachedMessage', [
          timeData[currentUrl].toString(),
          currentUrl,
        ]),
        iconUrl: 'images/notification.png',
    });
  }
}
