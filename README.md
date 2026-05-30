# Intention

A Chrome extension that forces you to state your intention before visiting any website. A mindfulness tool to combat mindless browsing and procrastination.

## How it works

When you navigate to a page, a full-screen overlay appears asking:

- **What's your intention?** — Why do you want to be here?
- **What are you feeling?** — bored, stressed, curious...
- A written explanation (minimum 25 characters)

You can't access the page content until you submit. All intentions are logged locally in your browser.

## Features

- Blocks every page until you write why you're visiting it
- Optional mood tracking
- Character counter with configurable minimum length requirement
- Browse your logged intentions in the popup
- Export logs as CSV
- Clear all data with one click

## Installation

1. Clone or download this repo
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the extension folder
5. The extension is now active on all sites

## Usage

Click the extension icon to open the popup, where you can:
- View your logged intentions (reverse chronological)
- See stats (total entries, today's count)
- Export data as CSV
- Clear all data
- Open Settings

In Settings, toggle **"Require intention writing"** on/off.

## Privacy

Everything stays in your browser's local storage. No data is sent anywhere.

## License

MIT
