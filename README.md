# Activity Watcher

Activity Watcher is a Chrome extension that observes your browsing activity and records the time spent on each website. It provides a simple interface to view and clear the recorded activity.

* Data is stored in chrome local storage. (Later it will be using chrome sync storage)

## Features

- Record the time spent on each website
- View the recorded activity in a popup
- Clear the recorded activity
- Set time limits for websites
- View time limits in a popup
- Delete time limits

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/RomanLesovoy/activity-watcher-ext.git
   ```
2. Open Chrome (or any Chromium-based browser) and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked."
5. Select the `activity-watcher-ext/dist` directory.
6. The extension should now be loaded.

## Usage

1. Click the Activity Watcher icon in the Chrome toolbar.
2. Switch to the "Statistics" tab. (default)
3. Click the "Clear" button to clear the recorded activity.
4. Switch to the "Limits" tab.
5. The popup will display the recorded activity.
6. Add time limits for websites.
7. Click the "Delete" button to delete the time limit.
