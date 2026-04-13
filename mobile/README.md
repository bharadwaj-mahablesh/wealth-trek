# Wealth Trek Mobile

React Native (Expo) mobile app for iOS and Android with feature parity to the Next.js web app.

## Project Structure

```
mobile/
├── app/                    # Expo Router file-based routes
│   ├── (auth)/             # Auth group (unauthenticated)
│   ├── (tabs)/             # Tab group (authenticated)
│   │   ├── index.tsx       # Dashboard
│   │   ├── snapshot.tsx    # Snapshot management
│   │   ├── tracker.tsx     # Wealth tracker
│   │   ├── analytics.tsx   # Analytics
│   │   └── more/           # Stack navigator
│   │       ├── index.tsx   # More menu
│   │       ├── goals.tsx   # Financial goals
│   │       ├── chat.tsx    # AI Chat
│   │       ├── profile.tsx # User profile
│   │       └── pricing.tsx # Subscription plans
│   └── _layout.tsx         # Root layout
├── components/             # UI components
│   └── ThemeProvider.tsx   # Theme context
├── hooks/                  # React hooks
├── lib/                    # Utilities
│   ├── api.ts              # API client
│   ├── storage.ts          # AsyncStorage helpers
│   ├── constants.ts        # App constants
│   ├── theme.ts            # Color tokens
│   └── computations.ts     # Net worth calculations
├── types/                  # TypeScript types
│   └── index.ts            # Shared types
└── assets/                 # Images, fonts
```

## Development Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Expo Go** app on your iOS/Android device
  - iOS: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
  - Android: [Download from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 1. Start the Backend API

The mobile app requires the Next.js backend to be running:

```bash
cd app
npm run dev -- --hostname 0.0.0.0
```

This starts the API on `http://localhost:3000` (accessible from your phone via local network).

### 2. Setup Mobile Environment

```bash
cd mobile

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your values:
```
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:3000
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

> **Find your IP:** On macOS, run `ipconfig getifaddr en0` to get your local IP address.

### 3. Start the Mobile App

```bash
# Clear Metro bundler cache and start
npx expo start --clear
```

You'll see a QR code in the terminal. **Scan it with Expo Go** on your phone.

### 4. Sign In

- The app will show the sign-in screen
- Use the same email/password as the web app
- Backend must be running for authentication to work

---

## Running Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev -- --hostname 0.0.0.0` | Start backend (from `app/` folder) |
| `npx expo start` | Start mobile dev server |
| `npx expo start --clear` | Start with cache clear (recommended after env changes) |
| `npx expo start --ios` | Start iOS simulator |
| `npx expo start --android` | Start Android emulator |
| `npx expo install <package>` | Install Expo-compatible package |

---

## Troubleshooting

### "Network request failed" or 401 errors

1. Ensure backend is running: `curl http://YOUR_IP:3000/api/health`
2. Verify `EXPO_PUBLIC_API_URL` uses your computer's **local IP** (not localhost)
3. Check phone and computer are on the **same WiFi network**
4. If stuck on "Session expired":
   - Tap **"Clear Session & Restart"** in More tab
   - Close Expo Go completely (swipe up)
   - Reopen Expo Go and scan QR again

### App shows old code after changes

```bash
npx expo start --clear
```

### Metro bundler won't start

```bash
# Kill any running Metro processes
npx kill-port 8081

# Or manually find and kill
lsof -ti:8081 | xargs kill -9
```

## Tech Stack

- **Framework**: React Native + Expo (~52)
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind + TailwindCSS
- **Auth**: @clerk/clerk-expo
- **Charts**: Victory Native + react-native-skia
- **Storage**: AsyncStorage
- **Payments**: react-native-razorpay

## Features

- [x] **Phase 1: Project scaffolding & foundation**
- [x] **Phase 2: Auth flow & API client**
  - Clerk authentication with sign-in/sign-out
  - Session management with SecureStore
  - API client with automatic 401 handling
  - "Clear Session & Restart" recovery button
- [x] **Phase 3: Snapshot tab - core data flow**
  - View, create, edit, delete statements
  - Real-time net worth calculations
  - Snapshot history with charts
- [x] **Phase 4: Tracker tab & charts**
  - Wealth tracking over time
  - Victory Native charts integration
- [x] **Phase 5: Dashboard & analytics**
  - Overview cards (assets, liabilities, net worth)
  - Quick stats and recent activity
- [x] **Phase 6: More stack**
  - Financial goals screen
  - AI Chat interface
  - User profile
  - Pricing & subscriptions
  - Dark/light theme toggle
- [ ] **Phase 7: Document upload, extraction & PDF**
- [x] **Phase 8: Polish**
  - Haptic feedback throughout app
  - Smooth animations & transitions
  - Error handling & recovery flows
