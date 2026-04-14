# Wealth Trek Mobile App — Implementation Plan

## Context

Wealth Trek is a personal balance sheet web app (Next.js 16). The goal is to build a React Native (Expo) mobile app for iOS and Android with full feature parity. The mobile app lives in `mobile/` alongside the existing `app/` directory, reuses the deployed Next.js API routes, and shares Clerk auth. A Supabase migration is in progress by another developer — we don't touch that.

Full design spec: `docs/superpowers/specs/2026-04-12-mobile-app-design.md`

## Critical Files to Reference

- `app/src/types/index.ts` — shared type definitions to duplicate
- `app/src/hooks/useStatements.ts` — pattern for API-backed hooks
- `app/src/hooks/useChatHistory.ts` — pattern for AsyncStorage-backed hooks
- `app/src/lib/computations.ts` — pure logic, copy verbatim
- `app/src/lib/generatePdf.ts` — PDF logic to re-implement as HTML for expo-print
- `app/src/app/globals.css` — theme tokens (OKLCH → hex conversion needed)

## Phase 1: Project Scaffolding & Foundation

**Goal**: Expo app boots on simulator with NativeWind styling and tab navigation skeleton.

Create:
- `mobile/package.json`, `app.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`
- `mobile/tailwind.config.ts` — NativeWind theme with hex color tokens from spec
- `mobile/lib/theme.ts` — light + dark color token objects (OKLCH converted to hex)
- `mobile/types/index.ts` — copy of `app/src/types/index.ts`
- `mobile/app/_layout.tsx` — root layout with font loading + ThemeProvider stub
- `mobile/app/(auth)/_layout.tsx`, `sign-in.tsx`, `sign-up.tsx` — placeholder auth screens
- `mobile/app/(tabs)/_layout.tsx` — bottom tab navigator (5 tabs with lucide icons)
- `mobile/app/(tabs)/index.tsx`, `snapshot.tsx`, `tracker.tsx`, `analytics.tsx` — placeholders
- `mobile/app/(tabs)/more/_layout.tsx`, `more/index.tsx` — stack navigator placeholder

**Verify**: `npx expo start` launches app. All 5 tabs render. Light/dark theme toggle works.

## Phase 2: Auth Flow & API Client

**Goal**: User signs in with Clerk, API client fetches data from deployed backend.

Create:
- `mobile/lib/api.ts` — `createApiClient(getToken)` factory returning typed methods for all endpoints. Prepends `EXPO_PUBLIC_API_URL`, injects Bearer token.
- `mobile/lib/storage.ts` — AsyncStorage get/set/remove helpers with JSON serialization
- `mobile/lib/constants.ts` — statement type presets, storage keys
- `mobile/components/ui/Button.tsx`, `Input.tsx`, `Card.tsx` — NativeWind primitives
- `mobile/app/(auth)/sign-in.tsx`, `sign-up.tsx` — real Clerk auth via `useSignIn()`/`useSignUp()`
- Update `mobile/app/_layout.tsx` — ClerkProvider, auth redirect logic

**Risk**: Verify that Clerk's `auth()` on the server accepts Bearer tokens from mobile (not just cookies). Test early. If it fails, may need to configure `authorizedParties` in Clerk middleware.

**Verify**: Sign in on simulator. Confirm `api.getStatements()` returns data via console.log.

## Phase 3: Snapshot Tab — Core Data Flow

**Goal**: Full statement CRUD + save snapshot. Proves the entire data pipeline.

Create:
- `mobile/hooks/useStatements.ts` — mirrors web, uses api client
- `mobile/hooks/useNetWorthHistory.ts` — mirrors web, uses api client
- `mobile/hooks/useUserProfile.ts` — AsyncStorage-based
- `mobile/lib/computations.ts` — copy verbatim from `app/src/lib/computations.ts`
- `mobile/components/NetWorthSummary.tsx` — sticky summary card
- `mobile/components/StatementList.tsx` — FlatList, grouped by category, swipe-to-delete
- `mobile/components/StatementForm.tsx` — bottom sheet form via `@gorhom/bottom-sheet`
- `mobile/components/ui/BottomSheet.tsx`, `ui/Select.tsx` — primitives

**Verify**: Add statements, edit, delete via swipe. Net worth summary updates live. Save a snapshot with date + name. Reload app — data persists from server.

## Phase 4: Tracker Tab & Charts

**Goal**: Net worth trend chart renders. Snapshot history is browsable.

Create:
- `mobile/components/charts/chartTheme.ts` — Victory theme using theme colors
- `mobile/components/charts/NetWorthTrendChart.tsx` — VictoryLine, 3 series, touch-to-inspect
- `mobile/components/charts/GrowthChart.tsx` — simpler version for dashboard
- `mobile/components/charts/PieChart.tsx` — VictoryPie wrapper for analytics
- `mobile/app/(tabs)/tracker.tsx` — real implementation with expandable snapshot history

**Risk**: Victory Native + Skia setup can be tricky with Expo managed workflow. Test with hardcoded data first. May need `expo prebuild` if native modules don't resolve.

**Verify**: With 2+ snapshots, trend chart shows lines. Touch shows tooltip. Expand a snapshot row to see breakdown.

## Phase 5: Dashboard & Analytics

**Goal**: Home screen with wealth overview. Analytics with change metrics and pie charts.

Create:
- `mobile/components/NetWorthCard.tsx` — large card with net worth, change %, brand gradient
- `mobile/components/ui/FAB.tsx` — floating action button
- `mobile/components/GoalCard.tsx` — horizontal scroll milestone card
- `mobile/components/ui/InsightCard.tsx` — intelligence feed card
- `mobile/app/(tabs)/index.tsx` — real Dashboard
- `mobile/app/(tabs)/analytics.tsx` — real Analytics (change metrics, top movements, pie charts, suggestions)

**Verify**: Dashboard shows correct net worth. FAB opens statement form. Analytics shows correct deltas between last two snapshots. Pie charts render.

## Phase 6: More Stack — Goals, Chat, Profile, Pricing

**Goal**: All secondary features work including AI chat streaming and Razorpay checkout.

Create:
- `mobile/hooks/useChatHistory.ts` — AsyncStorage-based
- `mobile/hooks/useFinancialGoals.ts` — AsyncStorage-based
- `mobile/hooks/useSubscription.ts` — API-based
- `mobile/hooks/useRazorpayCheckout.ts` — uses `react-native-razorpay`
- `mobile/components/ChatMessage.tsx` — bubble layout
- `mobile/app/(tabs)/more/goals.tsx` — goal cards with status actions
- `mobile/app/(tabs)/more/chat.tsx` — streaming chat with goal extraction
- `mobile/app/(tabs)/more/profile.tsx` — form with AsyncStorage persistence
- `mobile/app/(tabs)/more/pricing.tsx` — plan cards + Razorpay native checkout

**Risk**: SSE streaming — `EventSource` isn't native in RN. Use `react-native-sse` or manual `fetch` with `ReadableStream`. If problematic, fallback to non-streaming POST with a `?stream=false` query param (would need a small API route change).

**Verify**: Chat streams tokens. Goal extraction (`|||GOAL|||` markers) works. Goals screen shows CRUD. Profile persists across restarts. Razorpay checkout opens in test mode.

## Phase 7: Document Upload, Extraction & PDF

**Goal**: Camera capture + file picker work. AI extraction review. PDF certificate generation.

Create:
- `mobile/hooks/useDocuments.ts` — API-based upload/extract/delete
- `mobile/components/DocumentUpload.tsx` — camera (`expo-camera`) + file picker (`expo-document-picker`)
- `mobile/components/ExtractionReview.tsx` — full-screen modal, editable entries
- `mobile/lib/generatePdf.ts` — HTML template → `expo-print` → `expo-sharing`

**Verify**: Upload PDF via file picker. Extract entries. Review and approve. Entries appear in statements. Take photo with camera, upload, extract. Generate PDF certificate and share.

## Phase 8: Polish, Haptics, Animations & Testing

**Goal**: Production-quality feel. Mobile enhancements. Test coverage.

Create/update:
- `mobile/components/ThemeToggle.tsx` — manual light/dark toggle
- `mobile/components/FirstSnapshotOnboarding.tsx` — onboarding overlay
- `mobile/lib/haptics.ts` — expo-haptics wrappers
- Pull-to-refresh on all list screens
- Keyboard avoidance on all form screens
- Loading skeletons, error toasts, offline banner (`@react-native-community/netinfo`)
- Tests: `__tests__/hooks/`, `__tests__/lib/`, `__tests__/components/`

**Verify**: Run on both iOS simulator and Android emulator. Walk through every screen. Haptics fire on device. Theme toggle works. Offline banner appears when network off. `npm test` passes.

## Verification — End-to-End

After all phases:
1. Fresh sign-in → onboarding flow → add 3 statements → save snapshot
2. View tracker chart → analytics with metrics
3. Open AI chat → ask for advice → extract goal → see on goals screen
4. Upload document → extract → review → approve entries
5. Generate PDF certificate → share
6. Check pricing → test Razorpay checkout
7. Toggle theme → verify all screens in both modes
8. Kill app → reopen → verify data persists
9. Run full test suite: `cd mobile && npm test`
