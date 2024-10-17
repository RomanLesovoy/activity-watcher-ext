document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
  const timeList = document.getElementById('timeList');

  chrome.storage.local.get(['timeData'], (result) => {
    const timeData = result.timeData || {};
    
    for (const [url, time] of Object.entries(timeData)) {
      const li = document.createElement('li');
      li.textContent = `${url}: ${formatTime(time as number)}`;
      timeList?.appendChild(li);
    }
  });

  document?.getElementById('clearButton')?.addEventListener('click', () => {
    chrome.storage.local.remove(['timeData'], () => {
      location.reload();
    });
  });
});

function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours}ч ${minutes % 60}м ${seconds % 60}с`;
}
