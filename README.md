# WhatsApp Broadcast Messenger

A web application for broadcasting messages and images to multiple WhatsApp contacts using WhatsApp Web automation.

## Tags

- **Languages**: JavaScript
- **Frameworks**: Vue.js 3, Express.js
- **Build Tools**: Vite
- **Libraries**: whatsapp-web.js, Multer, CSV-Parser, Three.js

## Description

This project consists of a frontend and backend system that allows users to upload three images and send them as a broadcast to selected WhatsApp contacts. The backend automates the WhatsApp Web interface to send messages and images, then terminates the processes after completion.

## Prerequisites

- Node.js (version 20.19.0 or higher, or 22.12.0+)
- npm
- Google Chrome browser installed (for WhatsApp Web automation)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BettinaShirley/BroadcastMessaging.git
   cd BroadcastMessaging
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```

## Setup

1. Generate CSV file with chat details:
   ```bash
   cd backend
   node fetchChatDetails.js
   ```
   This will create `backend/data/chats.csv`.

## Usage

1. Run the application:
   ```bash
   chmod 777 run.sh
   ./run.sh
   ```
   This script will:
   - Clear cache
   - Start the backend server on port 3001
   - Start the frontend on localhost:5173

2. Open your browser and go to `http://localhost:5173`

3. Upload exactly 3 images using the file input.

4. Click "Send Broadcast" to start the process.

5. A Chromium window will open with WhatsApp Web. Scan the QR code with your phone to log in.

6. The system will automatically send the 3 images and a "Blessed morning!" message to all selected contacts.

7. After 10 minutes, the browser and processes will be terminated automatically.

## Project Structure

```
BroadcastMessaging/
├── backend/
│   ├── clearCache.sh          # Cache cleanup script
│   ├── data/                  # Directory for CSV files
│   ├── fetchChatDetails.js    # Script to fetch WhatsApp chats
│   ├── images/                # Directory for uploaded images
│   ├── package.json           # Backend dependencies
│   ├── server.js              # Express server
│   └── whatsapp.js            # WhatsApp automation script
├── frontend/
│   ├── package.json           # Frontend dependencies
│   ├── src/
│   │   ├── App.vue            # Main Vue component
│   │   └── components/
│   │       └── Starfield.vue  # Background component
│   └── vite.config.js         # Vite configuration
├── run.sh                     # Main startup script
└── README.md                  # This file
```

## API Endpoints

- `POST /api/upload`: Upload 3 images
- `POST /api/send-broadcast`: Start WhatsApp broadcast

## Notes

- Ensure your phone is connected to the internet during the broadcast process.
- The system uses headless Chrome for automation, so Google Chrome must be installed.
- Processes on ports 3001 and 5173 will be killed after the broadcast completes.
- Make sure to update the CSV file with the correct contact IDs before running.

## Troubleshooting

- If the frontend doesn't load, ensure Vite is installed: `cd frontend && npm install`
- If WhatsApp Web doesn't load, check your internet connection and Chrome installation.
- For any issues with dependencies, try deleting `node_modules` and running `npm install` again.
- Check if chromium is installed `brew install chromium`
