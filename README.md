# Handsome Paul

**Handsome Paul** is a Chrome/Edge browser extension that transforms Paul Graham's website (paulgraham.com) into a modern, beautiful reading experience.

![Handsome Paul Preview](https://github.com/user-attachments/assets/placeholder-image)
*(You can add a screenshot here after pushing images)*

## Features

- **Modern Typography**: Replaces the default fonts with **Inter** (Sans-Serif) for a clean, professional look.
- **Optimal Reading Width**: Constraints the text to a standard **800px** width, perfect for long-form reading.
- **Borderless Design**: Removes legacy table borders and "boxed" layouts for a spacious, minimalist feel.
- **Sticky Top Bar**: Adds a functional, glassmorphic top navigation bar with quick links to Essays, Books, and Bio.
- **Reading Progress**: A subtle orange progress bar at the top tracks your reading position.
- **List Page Cleanup**: Automatically detects essay lists (like `articles.html`) and transforms them into clean, unbulleted lists.
- **Legacy Fixes**: Forces legacy fixed-width tables (often 435px) to flow naturally at full width.

## Installation (Developer Mode)

Since this extension is not yet in the Chrome Web Store, you can install it manually:

1.  Clone this repository:
    ```bash
    git clone https://github.com/arxisme/Handsome-paul.git
    ```
2.  Open your browser (Chrome or Edge) and go to the Extensions page:
    *   **Chrome**: `chrome://extensions`
    *   **Edge**: `edge://extensions`
3.  Enable **"Developer mode"** (usually a toggle in the top right corner).
4.  Click **"Load unpacked"**.
5.  Select the folder where you cloned this repository (`handsome_paul`).
6.  Navigate to [paulgraham.com/goodwriting.html](https://paulgraham.com/goodwriting.html) to see it in action!

## Usage

The extension works automatically on `paulgraham.com`.
- **Essay Pages**: Automatically reformatted for reading.
- **Index Pages**: Cleaned up for easy browsing.

## Tech Stack

- **Manifest V3**: Modern browser extension standard.
- **Vanilla JS**: No frameworks, lightweight content scripts.
- **CSS3**: Variables, Flexbox, Glassmorphism backdrop-filters.

## License

MIT
