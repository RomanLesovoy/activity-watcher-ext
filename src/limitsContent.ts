import { checkTimeLimit, getTimeLimits, ifTimeLimitReached, setTimeLimit } from "./limits";

let timeLimitsTitle: HTMLHeadingElement;
let timeLimitsList: HTMLUListElement;

/**
 * Initialize limits content
 */
document.addEventListener('DOMContentLoaded', () => {
  timeLimitsTitle = document.getElementById('timeLimitsTitle') as HTMLHeadingElement;
  timeLimitsList = document.getElementById('timeLimitsList') as HTMLUListElement;

  timeLimitsTitle.textContent = chrome.i18n.getMessage('timeLimitsTitle');

  renderTimeLimits();
  initializeAddLimitForm();
});

/**
 * Initialize add limit form
 */
function initializeAddLimitForm() {
  const addLimitForm = document.getElementById('addLimitForm') as HTMLFormElement;
  const urlInput = document.getElementById('urlInput') as HTMLInputElement;
  const hoursInput = document.getElementById('hoursInput') as HTMLInputElement;
  const addLimitButton = document.getElementById('addLimitButton') as HTMLButtonElement;

  addLimitButton.textContent = chrome.i18n.getMessage('addLimitButton');
  urlInput.placeholder = chrome.i18n.getMessage('urlPlaceholder');
  hoursInput.placeholder = chrome.i18n.getMessage('hoursPlaceholder');

  addLimitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAddLimit(urlInput.value, Number(hoursInput.value));
  });
}

/**
 * Handle deleting time limit
 */
async function handleDeleteLimit(url: string) {
  if (confirm(chrome.i18n.getMessage('deleteConfirm', [url]))) {
    await setTimeLimit(url, 0);
    await renderTimeLimits();
  }
}

/**
 * Handle adding new time limit
 */
async function handleAddLimit(url: string, hours: number) {
  try {
    const urlObj = new URL(url).hostname;
    if (url && !isNaN(hours) && hours > 0 && urlObj) {
      await setTimeLimit(url, hours);
      await renderTimeLimits();
    } else {
      throw new Error(chrome.i18n.getMessage('invalidInput'));
    }
  } catch (e) {
    alert((e as unknown as Error).message);
  }
}

/**
 * Render time limits
 */
async function renderTimeLimits() {
  timeLimitsList.innerHTML = '';
  const timeLimits = Object.entries((await getTimeLimits()) || {});
  const timeLimitsFiltered = timeLimits
    .filter(([_, time]: [string, number]) => time > 0);

  timeLimitsFiltered
    .forEach(([url, time]: [string, number]) => {
      const li = document.createElement('li');
      li.textContent = `${url}: ${time} ${chrome.i18n.getMessage('hours')}`;
      // @ts-ignore
      ifTimeLimitReached(timeLimits[url], time) && (li.style.color = 'red');
      timeLimitsList?.appendChild(li);

      appendDeleteLimitButton(li, url);
  });

  if (timeLimitsFiltered.length === 0) {
    renderTimeLimitsNoData();
  }
}

/**
 * Append delete limit button
 */
function appendDeleteLimitButton(li: HTMLLIElement, url: string) {
  const deleteLimitButton = document.createElement('button');
  deleteLimitButton.classList.add('deleteLimitButton');
  deleteLimitButton.addEventListener('click', () => handleDeleteLimit(url));
  li.appendChild(deleteLimitButton);
}

/**
 * Render no data
 */
function renderTimeLimitsNoData() {
  const li = document.createElement('li');
  li.textContent = chrome.i18n.getMessage('noLimits');
  timeLimitsList?.appendChild(li);
}
