import { KEY_TIME_LIMITS, storageType } from './constants';
import { TimeData } from './types';
import { prepareUrl } from './helpers';
/**
 * Get time limits
 */
export async function getTimeLimits(): Promise<TimeData> {
  return (await chrome.storage[storageType].get([KEY_TIME_LIMITS]))[KEY_TIME_LIMITS] || {};
}

/**
 * Set time limit for a url
 */
export async function setTimeLimit(url: string, hoursSpent: number): Promise<void> {
  const timeLimits = (await getTimeLimits()) || {};
  timeLimits[url] = hoursSpent;
  chrome.storage[storageType].set({ [KEY_TIME_LIMITS]: timeLimits });
}

/**
 * Check if time limit is reached for a url
 */
export async function checkTimeLimit(url: string, hoursSpent: number): Promise<boolean> {
  const limits = (await getTimeLimits()) || {};
  const limit: number = limits[prepareUrl(url)];
  return ifTimeLimitReached(limit, hoursSpent);
}

export function ifTimeLimitReached(limit: number | undefined, hoursSpent: number): boolean {
  return limit ? hoursSpent > limit : false;
}

/**
 * Execute time limit check for a url
 */
export async function execTimeLimitCheck(currentUrl: string, _: chrome.tabs.Tab, timeData: TimeData) {
  const hoursSpent = timeData[currentUrl] / 3600000;
  const limitReached = await checkTimeLimit(currentUrl, hoursSpent);

  if (limitReached) {
    // tab.id && chrome.tabs.remove(tab.id!); // note: this will close the tab, not the window
    chrome.notifications.create({
      type: 'basic',
      title: chrome.i18n.getMessage('timeLimitReachedTitle'),
      message: chrome.i18n.getMessage('timeLimitReachedMessage', [
        Math.round(hoursSpent).toString(),
        currentUrl,
      ]),
      iconUrl: 'images/notification.png',
  });
  }
}
