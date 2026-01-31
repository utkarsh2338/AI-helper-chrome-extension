# Contextly - Context-Aware AI Assistant

A Chrome extension that provides context-aware AI assistance for filling forms and answering questions based on selected text.

![Contextly](https://img.shields.io/badge/Chrome-Extension-blue) ![Node.js](https://img.shields.io/badge/Node.js-Backend-green) ![React](https://img.shields.io/badge/React-Frontend-61DAFB)

## Features

- 🔮 **Context-Aware AI** - Understands the context of the page and form fields
- ✨ **Smart Selection** - Select any text and get AI-powered assistance
- 🔑 **BYOK Support** - Bring Your Own Key - Use your personal Gemini API key
- 🎨 **Beautiful UI** - Modern dark glass theme with smooth animations
- 📋 **Quick Actions** - Copy responses with one click
- ⚡ **Fast Response** - Powered by Google's Gemini AI

## Project Structure

```
contextly/
├── backend/          # Express.js API server
│   ├── server.js     # Main server file
│   ├── .env.example  # Environment variables template
│   └── package.json
├── frontend/         # React settings dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Settings.jsx
│   │   │   └── Response.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── extension/        # Chrome extension
│   ├── manifest.json
│   ├── content.js    # Main extension logic
│   ├── popup.html
│   └── popup.js
└── README.md
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Chrome browser
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/contextly.git
cd contextly
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env

# Add your Gemini API key to .env
# GEMINI_API_KEY=your_api_key_here

# Start the server
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Load Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The Contextly extension should now appear in your extensions

## Usage

1. **Start the servers** - Make sure both backend and frontend are running
2. **Visit any webpage** - The extension works on all websites
3. **Select text** - Highlight any text on the page
4. **Click "Ask Shukla"** - A floating button will appear near your selection
5. **View Response** - A side panel will open with the AI response
6. **Copy** - Use the Copy button to copy the response

### Settings

Access settings by:
- Clicking the extension icon → "Open Settings"
- Or visiting `http://localhost:5173` directly

In settings, you can:
- Add your own Gemini API key (BYOK)
- Test if your API key is working
- Remove your API key

## Development

### Backend

```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend

```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Extension

After making changes to the extension files:
1. Go to `chrome://extensions/`
2. Click the refresh icon on the Contextly extension

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ask` | POST | Send context and get AI response |
| `/settings/apikey` | GET | Check if API key is configured |
| `/settings/apikey` | POST | Save API key |
| `/settings/apikey` | DELETE | Remove API key |
| `/test-key` | POST | Test if API key is valid |

## Tech Stack

- **Backend**: Node.js, Express.js, Google Generative AI
- **Frontend**: React 19, Vite, CSS3
- **Extension**: Chrome Manifest V3, Vanilla JavaScript

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Powered by [Google Gemini AI](https://ai.google.dev/)
- Built with ❤️ for making form filling easier
