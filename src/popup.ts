import './statisticsContent';
import './limitsContent';

let title: HTMLTitleElement;
let limitsContent: HTMLDivElement;
let statisticsContent: HTMLDivElement;
let limitsTab: HTMLButtonElement;
let statisticsTab: HTMLButtonElement;

/**
 * Initialize popup
 */
document.addEventListener('DOMContentLoaded', () => {
  title = document.getElementById('extTitle') as HTMLTitleElement;
  title.textContent = chrome.i18n.getMessage('extName');

  initializeTabsAndContent();
});

/**
 * Initialize tabs and content
 */
function initializeTabsAndContent() {
  limitsContent = document.getElementById('timeLimitsContent') as HTMLDivElement;
  statisticsContent = document.getElementById('timeStatisticsContent') as HTMLDivElement;

  limitsTab = document.getElementById('timeLimitsButtonTab') as HTMLButtonElement;
  limitsTab.textContent = chrome.i18n.getMessage('timeLimitsButtonTab');
  statisticsTab = document.getElementById('timeStatisticsButtonTab') as HTMLButtonElement;
  statisticsTab.textContent = chrome.i18n.getMessage('timeStatisticsButtonTab');

  limitsTab.addEventListener('click', () => {
    limitsContent.classList.add('active');
    statisticsContent.classList.remove('active');
    limitsTab.classList.add('active');
    statisticsTab.classList.remove('active');
  });

  statisticsTab.addEventListener('click', () => {
    limitsContent.classList.remove('active');
    statisticsContent.classList.add('active');
    limitsTab.classList.remove('active');
    statisticsTab.classList.add('active');
  });
}
