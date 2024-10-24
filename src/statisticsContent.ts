import { KEY_MOST, storageType, SHOW_SECONDS, KEY_ALL } from "./constants";
import { getMostVisited } from "./statistics";
import { formatTime } from "./helpers";


let timeStatisticsTitle: HTMLHeadingElement = document.getElementById('timeStatisticsTitle') as HTMLHeadingElement;
let timeStatisticsList: HTMLUListElement = document.getElementById('timeStatisticsList') as HTMLUListElement;
let clearTimeStatisticsButton: HTMLButtonElement = document.getElementById('clearTimeStatisticsButton') as HTMLButtonElement;

/**
 * Initialize statistics content
 */
document.addEventListener('DOMContentLoaded', () => {
  timeStatisticsTitle.textContent = chrome.i18n.getMessage('timeStatisticsTitle');
  clearTimeStatisticsButton.textContent = chrome.i18n.getMessage('clearTimeStatisticsButton');

  renderMostVisited();

  clearTimeStatisticsButton?.addEventListener('click', async () => {
    if (confirm(chrome.i18n.getMessage('clearConfirm'))) {
      await chrome.storage[storageType].remove(KEY_MOST);
      await chrome.storage[storageType].remove([KEY_ALL]);
      location.reload();
    }
  });
});

/**
 * Render most visited sites
 */
async function renderMostVisited() {
  timeStatisticsList.innerHTML = '';
  const mostVisited = Object.entries((await getMostVisited() || {}));
  const mostVisitedFiltered = mostVisited
    .filter(([_, time]: [string, number]) => !SHOW_SECONDS ? time > 60000 : time > 1000);

  mostVisitedFiltered
    .forEach(([url, time]: [string, number]) => {
      const li = document.createElement('li');
      li.textContent = `${url}: ${formatTime(time as number, SHOW_SECONDS)}`;
      timeStatisticsList?.appendChild(li);
    });

  if (mostVisitedFiltered.length === 0) {
    renderStatisticsNoData();
    clearTimeStatisticsButton.disabled = true;
  }
}

/**
 * Render no data
 */
function renderStatisticsNoData() {
  const li = document.createElement('li');
  li.textContent = chrome.i18n.getMessage('noData');
  timeStatisticsList?.appendChild(li);
}
