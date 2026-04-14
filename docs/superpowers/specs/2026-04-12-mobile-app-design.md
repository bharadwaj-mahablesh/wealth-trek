# Wealth Trek Mobile App — Design Spec

## Overview

Build a React Native (Expo) mobile app for iOS and Android with full feature parity to the existing Next.js web app. The mobile app lives in the same monorepo (`mobile/` alongside `app/`), reuses the existing Next.js API routes, and shares the same Clerk authentication and Supabase-bound database.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | React Native + Expo (~52) | Leverages existing React/TypeScript skills |
| Routing | Expo Router (file-based) | Mirrors Next.js App Router pattern |
| Styling | NativeWind + TailwindCSS | Same utility classes as the web app |
| Charts | Victory Native + react-native-skia | Best quality for financial data; declarative API |
| Auth | @clerk/clerk-expo | Same provider as web; shared user accounts |
| Payments | react-native-razorpay | Full in-app payment flow matching web |
| Backend | Existing Next.js API routes | Supabase migration in progress by another developer |
| Local storage | AsyncStorage | Mirrors localStorage for goals/chat/profile; server migration deferred to Supabase work |
| Repo structure | Monorepo (`mobile/` directory) | Shared types, easier to keep in sync |

## Project Structure

```
wealth-trek/
├── app/                      # Existing Next.js web app (unchanged)
├── mobile/                   # New Expo app
│   ├── app/                  # Expo Router file-based routes
│   │   ├── _layout.tsx       # Root layout: ClerkProvider + ThemeProvider + font loading
│   │   ├── (auth)/           # Auth group (unauthenticated)
│   │   │   ├── _layout.tsx
│   │   │   ├── sign-in.tsx
│   │   │   └── sign-up.tsx
│   │   └── (tabs)/           # Tab group (authenticated)
│   │       ├── _layout.tsx   # Tab navigator config
│   │       ├── index.tsx     # Dashboard (home tab)
│   │       ├── snapshot.tsx  # Snapshot management
│   │       ├── tracker.tsx   # Wealth tracker
│   │       ├── analytics.tsx # Analytics
│   │       └── more/         # Stack navigator
│   │           ├── _layout.tsx
│   │           ├── index.tsx     # More menu
│   │           ├── goals.tsx
│   │           ├── chat.tsx
│   │           ├── profile.tsx
│   │           └── pricing.tsx
│   ├── components/           # Mobile UI components
│   │   ├── ui/               # Primitives (Button, Card, Input, etc.)
│   │   ├── charts/           # Victory Native chart wrappers
│   │   ├── NetWorthCard.tsx
│   │   ├── StatementForm.tsx
│   │   ├── StatementList.tsx
│   │   ├── DocumentUpload.tsx
│   │   ├── ExtractionReview.tsx
│   │   ├── GoalCard.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/                # Mobile hooks (mirroring web hooks)
│   │   ├── useStatements.ts
│   │   ├── useNetWorthHistory.ts
│   │   ├── useChatHistory.ts
│   │   ├── useFinancialGoals.ts
│   │   ├── useDocuments.ts
│   │   ├── useUserProfile.ts
│   │   ├── useSubscription.ts
│   │   └── useRazorpayCheckout.ts
│   ├── lib/                  # Utilities
│   │   ├── api.ts            # Centralized API client with auth headers
│   │   ├── storage.ts        # AsyncStorage wrappers
│   │   ├── theme.ts          # Color tokens (OKLCH converted to hex)
│   │   ├── computations.ts   # Net worth calculations (shared logic)
│   │   └── constants.ts      # Statement presets, config
│   ├── types/                # TypeScript types (mirrored from web)
│   │   └── index.ts
│   ├── assets/               # Images, fonts
│   ├── app.json              # Expo config
│   ├── tailwind.config.ts    # NativeWind theme config
│   ├── tsconfig.json
│   └── package.json
├── docs/
├── CLAUDE.md
└── VISION.md
```

## Navigation

Five bottom tabs for authenticated users:

| Tab | Icon | Screen | Key Features |
|---|---|---|---|
| Dashboard | `Home` | Home/overview | Net worth card, growth chart, milestones, insights, quick actions (FAB) |
| Snapshot | `Camera` | Statement mgmt | Statement list, add/edit (bottom sheet), document upload, save snapshot, PDF |
| Tracker | `TrendingUp` | Wealth tracker | Net worth trend chart, snapshot history with expandable rows |
| Analytics | `BarChart3` | Analytics | Change metrics, top movements, pie charts, suggestions |
| More | `Menu` | Stack navigator | Goals, AI Chat, Profile, Pricing/Subscription |

Auth group: sign-in and sign-up screens using Clerk's `useSignIn()` / `useSignUp()` hooks. Root layout redirects based on `isSignedIn` state.

## API Client & Authentication

### API Client (`mobile/lib/api.ts`)

- Base URL configurable via environment variable (`EXPO_PUBLIC_API_URL`)
- Attaches `Authorization: Bearer <token>` header using Clerk's `useAuth().getToken()`
- Typed functions for each endpoint:
  - `getStatements()`, `createStatements(entries)`, `updateStatement(id, data)`, `deleteStatement(id)`
  - `getSnapshots()`, `createSnapshot(data)`, `deleteSnapshot(id)`
  - `getSubscription()`
  - `createPaymentOrder(plan, cycle)`, `verifyPayment(data)`
  - `uploadDocument(file)`, `extractDocument(id, type)`, `deleteDocument(id)`
  - `streamChat(messages, snapshotSummary)` — returns SSE stream
- SSE streaming via `react-native-sse` or EventSource polyfill for chat endpoint

### Auth Flow

1. `<ClerkProvider>` wraps the entire app in root `_layout.tsx`
2. Root layout checks `isSignedIn` from `useAuth()`
3. Unauthenticated → `(auth)` group (sign-in/sign-up)
4. Authenticated → `(tabs)` group
5. Clerk's `@clerk/nextjs/server` `auth()` supports both cookie and Bearer token — no backend changes needed

## Screen-by-Screen Design

### Dashboard (Home Tab)

- **Net Worth Card**: Large card with current net worth, monthly change amount and percentage. Uses brand gradient for the net worth figure.
- **Growth Allocation Chart**: `VictoryLine` with three series (assets, liabilities, net worth). Touch-to-inspect data points.
- **Milestones**: Horizontal `FlatList` of up to 5 active goals with progress bars.
- **Intelligence Feed**: Three insight cards (net worth change, asset movements, liability trends) in a vertical list.
- **Quick Actions**: Floating Action Button (FAB) in bottom-right with options: "Add Asset", "Add Liability".
- **First-time onboarding**: Full-screen overlay guiding new users through first snapshot creation.

### Snapshot Tab

- **Statement List**: `FlatList` grouped by category (assets/liabilities) with swipe-to-delete via `react-native-gesture-handler`.
- **Add/Edit Statement**: Bottom sheet modal (`@gorhom/bottom-sheet`) with form fields: statement type (preset dropdown), description, closing balance, ownership percentage.
- **Document Upload**: Two options — file picker (`expo-document-picker` for PDF) and camera capture (`expo-camera` for images). Mobile-specific enhancement over web.
- **Extraction Review**: Full-screen modal with editable list of AI-extracted entries. Approve/reject individual entries before bulk save.
- **Net Worth Summary**: Sticky card at top showing total assets, total liabilities, net worth.
- **Save Snapshot**: Header button. Date picker for snapshot date, text input for full name.
- **PDF Certificate**: Generated via `expo-print` which uses a WebView to render HTML-to-PDF. The jsPDF logic from the web app will be adapted to produce an HTML template that `expo-print` converts to a native PDF, then shared via `expo-sharing`.

### Tracker Tab

- **Net Worth Trend Chart**: `VictoryLine` with time-series data. Pinch-to-zoom, touch-to-inspect.
- **Snapshot History**: `SectionList` with expandable rows. Each row shows date, net worth, and expand arrow.
- **Expanded View**: Asset distribution and liability breakdown within each snapshot row.
- **Delete Snapshot**: Swipe-to-delete gesture.

### Analytics Tab

- **Change Metrics**: Three cards at top (net worth change, assets change, liabilities change) with percentage badges.
- **Top Movements**: Scrollable list of statement types that changed most between snapshots.
- **Pie Charts**: Two `VictoryPie` charts — asset breakdown and liability breakdown by statement type.
- **Suggestions**: Card list with conditional financial advice based on detected patterns.

### Goals Screen (More → Goals)

- **Goal Cards**: Card per goal showing title, description, target amount, target date, status badge.
- **Status Actions**: Complete, pause, resume, delete via action buttons or long-press menu.
- **Grouped Display**: Sections for active, paused, completed goals.
- **Create Goal**: Link to AI Chat for goal extraction from conversation.

### AI Chat Screen (More → Chat)

- **Chat Interface**: Chat bubble layout with user messages right-aligned, AI responses left-aligned.
- **Streaming**: Real-time token-by-token rendering via SSE connection.
- **Goal Extraction**: Detected `|||GOAL|||` markers in AI response trigger a "Save Goal?" prompt.
- **Input**: Keyboard-aware text input at bottom with send button. Multiline support.
- **History**: Persisted in AsyncStorage. Clear history button in header.

### Profile Screen (More → Profile)

- **Form Fields**: Full name, address, date fields using native `TextInput` components.
- **Persistence**: AsyncStorage (mirrors web's localStorage behavior).

### Pricing Screen (More → Pricing)

- **Plan Cards**: Three tiers (Free, Professional, Enterprise) with feature lists.
- **Billing Toggle**: Monthly/yearly switch.
- **Checkout**: Razorpay native checkout via `react-native-razorpay`.
- **Subscription Status**: Banner showing current plan and expiry.

## Theming

The web app uses a custom OKLCH color system. Since React Native doesn't support OKLCH natively, all values are converted to hex/RGB equivalents.

### Light Theme

| Token | OKLCH (web) | Hex (mobile) |
|---|---|---|
| background | — | `#f7f8fa` |
| foreground | — | `#1a1e24` |
| card | — | `#ffffff` |
| primary | `oklch(0.48 0.10 222)` | `#1a6b8a` (approx) |
| accent | `oklch(0.48 0.09 152)` | `#2a7a5a` (approx) |
| muted | — | `#eef0f4` |
| muted-foreground | — | `#64748b` |
| destructive | — | `#dc2626` |
| success | — | `#16a34a` |
| border | — | `#d8dde5` |

### Dark Theme

| Token | OKLCH (web) | Hex (mobile) |
|---|---|---|
| background | — | `#0f1115` |
| foreground | — | `#e8eaf0` |
| card | — | `#1a1e24` |
| primary | `oklch(0.66 0.08 218)` | `#6ba3b8` (approx) |
| accent | `oklch(0.66 0.07 152)` | `#6aab8a` (approx) |
| muted | — | `#1e2228` |
| muted-foreground | — | `#8b9099` |
| destructive | — | `#7f1d1d` |
| success | — | `#14532d` |
| border | — | `#252a32` |

Note: Exact hex conversions should be verified at build time using an OKLCH-to-sRGB converter. The values above are approximations.

### Chart Colors (5 colors, light/dark variants)

Mapped from the web's `--chart-1` through `--chart-5` OKLCH values to hex equivalents.

### Theme Switching

- `useColorScheme()` for system preference detection
- Manual toggle stored in AsyncStorage (mirrors web's `next-themes`)
- NativeWind `darkMode: 'class'` configuration

### Brand Gradient

The web's shimmer gradient text (`text-brand-gradient`) will be implemented using `expo-linear-gradient` for background gradients and `react-native-masked-view` for gradient text effects.

## Mobile-Specific Enhancements

- **Camera capture**: Native camera for document scanning (web only has file picker)
- **Haptic feedback**: On key actions (save snapshot, delete statement) via `expo-haptics`
- **Pull-to-refresh**: On all list screens (statements, snapshots, goals)
- **Swipe gestures**: Swipe-to-delete on statements and snapshots
- **Keyboard avoidance**: `KeyboardAvoidingView` on all form screens

## Key Dependencies

| Purpose | Package |
|---|---|
| Framework | `expo` (~52) |
| Routing | `expo-router` |
| Styling | `nativewind`, `tailwindcss` |
| Auth | `@clerk/clerk-expo` |
| Charts | `victory-native`, `@shopify/react-native-skia` |
| Payments | `react-native-razorpay` |
| Bottom sheets | `@gorhom/bottom-sheet` |
| File picker | `expo-document-picker` |
| Camera | `expo-camera` |
| PDF | `expo-print` |
| Storage | `@react-native-async-storage/async-storage` |
| SSE | `react-native-sse` |
| Animations | `react-native-reanimated` |
| Icons | `lucide-react-native` |
| Gestures | `react-native-gesture-handler` |
| Haptics | `expo-haptics` |
| Gradient | `expo-linear-gradient` |

## Error Handling

- **Network errors**: Toast notification with retry option
- **Auth expiry**: Automatic redirect to sign-in screen
- **API errors**: User-friendly error messages matching web patterns
- **Offline state**: Display banner when no network; cached data remains viewable

## Testing Strategy

| Level | Tool | Scope |
|---|---|---|
| Unit | Jest (Expo default) | Hooks, utilities, computations |
| Component | React Native Testing Library | Individual component rendering and interaction |
| E2E | Maestro | Full user flows on device/simulator |

## Out of Scope

- Push notifications (future enhancement)
- Offline-first with local SQLite sync (deferred to Supabase migration)
- App Store / Play Store submission process (separate task)
- Shared code package extraction (optimize after initial build)
- Server-side storage for goals/chat/profile (handled by Supabase migration)
