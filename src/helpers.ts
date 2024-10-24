/**
 * Format time
 */
export function formatTime(ms: number, showSeconds: boolean = false) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const hoursText = hours ? `${hours}${chrome.i18n.getMessage('hours')} ` : '';
  const minutesText = minutes % 60 ? `${minutes % 60}${chrome.i18n.getMessage('minutes')} ` : '';
  const secondsText = seconds % 60 ? `${seconds % 60}${chrome.i18n.getMessage('seconds')}` : '';

  return `${hoursText}${minutesText}${showSeconds ? secondsText : ''}`.trim();
}

/**
 * Prepare url origin
 */
export function prepareUrl(url: string) {
  const urlWithProtocol = url.startsWith('http') || url.startsWith('https') ? url : `https://${url}`;
  const urlHostName = new URL(urlWithProtocol).origin;
  return urlHostName;
}
