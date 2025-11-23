# Expense Tracker - Telegram Bot WebView

Modern expense tracker application integrated with Telegram bot, featuring a premium UI with gradients, animations, and glassmorphism effects.

## Features

- 💰 **Balance Tracking**: View total balance with income and expenses
- 📊 **Statistics**: Visual charts showing weekly income vs expenses
- ➕ **Add Transactions**: Easily add income or expenses with categories
- 💳 **Multiple Cards**: Manage multiple payment cards
- 👤 **Profile Management**: User profile with settings and preferences
- 🔔 **Notifications**: Stay updated with transaction notifications
- ⚙️ **Settings**: Customize your experience

## Screens

1. **Onboarding** - Welcome screen with animated wallet illustration
2. **Home** - Balance card with recent transactions
3. **Overview** - Statistics with bar charts
4. **Add Transaction** - Form to add income/expenses
5. **My Cards** - Display of all payment cards
6. **Profile** - User information and account settings
7. **Settings** - App preferences and configuration

## Tech Stack

- **Frontend**: Angular 19
- **Backend**: Node.js + Express
- **Bot**: Telegram Bot API
- **Styling**: SCSS with modern design system
- **Storage**: In-memory (demo)

## Setup

### Prerequisites

- Node.js 18+ installed
- Telegram account
- Bot token from [@BotFather](https://t.me/botfather)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
The `.env` file is already created with your bot token:
```
BOT_TOKEN=7914603600:AAFuX5OVTImo5d602-IX2PX--Qb18-oOAHI
PORT=3000
WEBAPP_URL=http://localhost:4200
```

### Running the Application

You need to run both the bot server and the Angular dev server:

**Terminal 1 - Start the Telegram Bot**:
```bash
npm run bot
```

**Terminal 2 - Start the Angular App** (already running):
```bash
npm start
```

The Angular app will be available at `http://localhost:4200`

### Testing in Telegram

1. Open Telegram and search for your bot
2. Send `/start` command to the bot
3. Click the "💰 Ilovani ochish" button to open the webview
4. The expense tracker will open inside Telegram

### Testing in Browser

For development and testing outside Telegram:
1. Open `http://localhost:4200` in your browser
2. The app will work with demo data

## Project Structure

```
payment-webview/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Main component logic
│   │   ├── app.component.html     # All screens templates
│   │   ├── app.component.scss     # Premium styling
│   │   └── ...
│   ├── index.html                 # Telegram WebApp SDK
│   └── styles.scss                # Global styles
├── server.js                      # Telegram bot server
├── .env                          # Environment variables
└── package.json                  # Dependencies
```

## API Endpoints

- `GET /api/user/:userId` - Get user data
- `POST /api/transaction` - Add new transaction

## Design Features

- ✨ Vibrant gradient backgrounds
- 🎨 Glassmorphism effects
- 🎭 Smooth animations and transitions
- 📱 Mobile-first responsive design
- 🌈 Modern color palette
- 💫 Floating action button
- 🎯 Interactive elements with hover states

## Environment Variables

- `BOT_TOKEN` - Your Telegram bot token
- `PORT` - Server port (default: 3000)
- `WEBAPP_URL` - URL of the Angular app (default: http://localhost:4200)

## Development

The application uses:
- Angular standalone components
- TypeScript for type safety
- SCSS for advanced styling
- Telegram WebApp SDK for integration
- Express for REST API

## Notes

- Data is stored in-memory for demo purposes
- For production, integrate a database (MongoDB, PostgreSQL, etc.)
- Update `WEBAPP_URL` to your production URL when deploying
- Ensure HTTPS for production Telegram WebApp

## License

MIT
