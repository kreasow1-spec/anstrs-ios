# ANASTARS PERSONAL TATTOO
# iOS APPLICATION ARCHITECTURE & TECHNICAL SPECIFICATION

> **DOCUMENT ID:** `05_IOS_ARCHITECTURE.md`  
> **READ PRIORITY:** **6TH**  
> **REPOSITORY:** Separate Dedicated iOS Repository (Expo / React Native)  
> **TARGET OS:** iOS 16.0+ (iPhone optimized, iPad responsive)  
> **ARCHITECTURE PATTERN:** Feature-Sliced Clean Architecture with Offline-First Caching

---

## 1. Technology Stack Selection & Validation

The iOS mobile application is engineered on the modern React Native / Expo ecosystem for 60/120fps fluid performance and native tactile feedback:

| Layer | Library / Technology | Version Target | Rationale |
| :--- | :--- | :--- | :--- |
| **Framework** | **Expo (Managed Workflow)** | SDK 52+ | Rapid native builds, continuous updates, zero native Xcode config friction. |
| **Language** | **TypeScript** | `^5.6.0` | Strict type safety end-to-end, shared DTO types with backend. |
| **Routing** | **Expo Router** | `^4.0.0` | Typed file-based routing, native stack transitions, deep link support. |
| **Animations** | **React Native Reanimated** | `^3.16.0` | UI-thread 120fps spring physics, shared element transitions, gestural tracking. |
| **Gestures** | **React Native Gesture Handler**| `^2.20.0` | Native gesture recognizers (pinch-to-zoom, swipe-to-dismiss, interactive sheets). |
| **Server State** | **TanStack Query (React Query)**| `^5.59.0` | Stale-while-revalidate, automatic retry, optimistic mutations, query invalidation. |
| **Client State** | **Zustand** | `^5.0.0` | Lightweight store for active booking drafts, session filters, UI toggles. |
| **Secure Storage**| **expo-secure-store** | `^14.0.0` | Hardware-backed iOS Keychain storage for auth tokens and `X-Client-Token`. |
| **Fast Storage** | **react-native-mmkv** | `^3.1.0` | C++ synchronous key-value store for offline catalog and local healing logs. |
| **Image Engine** | **expo-image** | `^2.0.0` | Memory-optimized progressive image loading with Blurhash and disk caching. |
| **Media Picker** | **expo-image-picker** | `^16.0.0` | Camera and photo library picker for reference images with automatic compression. |
| **Haptics** | **expo-haptics** | `^14.0.0` | Subtle, tactile impact feedback on touches, sliders, and sheet snaps. |

---

## 2. Directory & Package Structure

```
anastars-ios/
├── app/                              # Expo Router File-Based Navigation
│   ├── (tabs)/                       # Main Tab Bar
│   │   ├── _layout.tsx               # Custom Dark Gothic Bottom Navigation Bar
│   │   ├── index.tsx                 # [Discover] Feed: Featured, Portfolio, Sketches
│   │   ├── booking.tsx               # [Book] Wizard: Step 1-4 with Live Calendar
│   │   ├── sanctuary.tsx             # [Sanctuary] Client Space: Active Session & History
│   │   └── studio.tsx                # [Studio] About Anastasia, FAQ, Contacts, Reviews
│   ├── portfolio/
│   │   └── [id].tsx                  # Work Detail Screen with Shared Element Zoom
│   ├── sketches/
│   │   └── [id].tsx                  # Sketch Detail Screen & "Reserve" CTA
│   ├── healing/
│   │   └── [token].tsx               # Interactive Day-by-Day Healing Tracker
│   ├── payment/
│   │   ├── checkout.tsx              # In-App Safari / WebBrowser payment sheet
│   │   └── success.tsx               # Confirmed Deposit celebration screen
│   ├── auth/
│   │   ├── login.tsx                 # Email/Password + 1-step Booking Login
│   │   └── register.tsx              # New Client Registration
│   ├── _layout.tsx                   # Root Stack, Providers, Theme & Auth Guards
│   └── +not-found.tsx
│
├── src/
│   ├── api/                          # HTTP Client & REST Endpoints
│   │   ├── client.ts                 # Axios / Fetch with Bearer & X-Client-Token interceptors
│   │   ├── config.ts                 # /api/v1/config hooks
│   │   ├── portfolio.ts              # /api/v1/portfolio queries
│   │   ├── sketches.ts               # /api/v1/sketches queries
│   │   ├── bookings.ts               # /api/v1/bookings mutations & slot checks
│   │   ├── payments.ts               # /api/v1/bookings/:id/payment mutations
│   │   ├── upload.ts                 # /api/v1/upload base64 compressor & uploader
│   │   └── healing.ts                # /api/v1/healing/:token queries
│   │
│   ├── auth/                         # Token Lifecycle & Auth Context
│   │   ├── AuthContext.tsx           # React Context wrapping auth state
│   │   ├── tokenStorage.ts           # SecureStore wrapper (get/set/clear token)
│   │   └── useAuth.ts                # Custom hook for login, logout, user profile
│   │
│   ├── components/                   # Atomic UI Component Library
│   │   ├── ui/                       # Buttons, Cards, Inputs, Badges, Typography
│   │   ├── layout/                   # ScreenWrapper, GothicHeader, BottomSheet
│   │   ├── visual/                   # BeforeAfterSlider, GothicArchBorder, BlurImage
│   │   └── feedback/                 # GothicToast, OfflineBanner, SkeletonLoader
│   │
│   ├── features/                     # Complex Domain Modules
│   │   ├── booking-wizard/           # Multi-step state machine, calendar, refs
│   │   ├── healing-tracker/          # Film vs bandage timelines, daily checklist
│   │   ├── portfolio-viewer/         # Masonry grid, style chips, full-screen lightbox
│   │   └── body-map/                 # Interactive anatomical tattoo placement canvas
│   │
│   ├── store/                        # Global State Stores (Zustand)
│   │   ├── bookingDraftStore.ts      # Temporary wizard state during booking
│   │   └── offlineCacheStore.ts      # MMKV offline persistence wrapper
│   │
│   ├── theme/                        # Design System Tokens
│   │   ├── colors.ts                 # Dark Gothic Luxury color palette
│   │   ├── typography.ts             # Font families, scale, line heights
│   │   └── spacing.ts                # Spacing scale, radii, layout constants
│   │
│   ├── animations/                   # Reanimated Physics & Shared Configurations
│   │   ├── springs.ts                # Mass, damping, stiffness presets
│   │   └── transitions.ts            # Screen enter/exit fade-scale animations
│   │
│   └── types/                        # TypeScript Interfaces & API Types
│       ├── api.ts                    # DTO interfaces matching backend contracts
│       └── navigation.ts             # Typed route params
```

---

## 3. Data Flow & State Management

```
┌────────────────────────────────────────────────────────────────────────┐
│                          iOS STATE ARCHITECTURE                        │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ SERVER STATE (TanStack Query v5)                               │   │
│   │  • Queries: portfolio, sketches, busy-slots, booking-status    │   │
│   │  • Mutations: createBooking, initiatePayment, submitReview     │   │
│   │  • Cache Time: 30 minutes | Stale Time: 5 minutes              │   │
│   │  • Persistent Query Cache via MMKV sync adapter                │   │
│   └──────────────────────┬─────────────────────────────────────────┘   │
│                          │                                             │
│   ┌──────────────────────┴─────────────────────────────────────────┐   │
│   │ CLIENT STATE (Zustand Stores)                                  │   │
│   │  • bookingDraftStore: in-progress form inputs, selected slot   │   │
│   │  • activeFilterStore: selected style filter, search queries    │   │
│   │  • uiStore: modal sheet states, toast notifications            │   │
│   └──────────────────────┬─────────────────────────────────────────┘   │
│                          │                                             │
│   ┌──────────────────────┴─────────────────────────────────────────┐   │
│   │ SECURE CREDENTIALS (expo-secure-store / Keychain)               │   │
│   │  • jwt_auth_token                                              │   │
│   │  • x_client_token (guest booking access token)                 │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. API Client Layer & Error Interception

All network requests flow through a unified API client:
- **Base URL Injection**: Configured via `EXPO_PUBLIC_API_URL`.
- **Request Interceptor**: Automatically attaches `Authorization: Bearer <token>` from SecureStore if available. For guest users with an active booking, attaches `X-Client-Token`.
- **Response Interceptor**:
  - Handles `401 Unauthorized` by triggering `authStore.logout()` and navigating to login sheet.
  - Formats errors using the standard `{ error, code }` schema.
  - Automatically retries idempotent network failures with exponential backoff.

---

## 5. Offline & Caching Strategy

1. **Portfolio & Sketches Cache**: Catalog data loaded from `/api/v1/portfolio` is cached in MMKV. If the user opens the app in airplane mode or with poor cellular reception (e.g. Saint Petersburg metro), the app displays the cached catalog with a subtle "Offline mode — viewing saved gallery" indicator.
2. **Image Caching via `expo-image`**: High-resolution tattoo photos are cached to iOS disk storage with aggressive max-age policies (`cachePolicy: 'disk'`).
3. **Optimistic Local Actions**: Marking items off the daily healing checklist updates local MMKV state immediately without waiting for server network rounds.

---

## 6. Deep Linking & URL Schemes

The application registers the native URL scheme: `anastars://`

| Deep Link Route | In-App Screen Destination | Purpose |
| :--- | :--- | :--- |
| `anastars://portfolio/:id` | `portfolio/[id].tsx` | Opening shared portfolio work |
| `anastars://sketches/:id` | `sketches/[id].tsx` | Opening shared flash sketch |
| `anastars://booking` | `(tabs)/booking.tsx` | Launching booking wizard |
| `anastars://payment/success?bookingId=:id` | `payment/success.tsx` | Return from ЮKassa payment sheet |
| `anastars://healing/:token` | `healing/[token].tsx` | Direct access to personal aftercare protocol |

---

## 7. App Store & Production Readiness Standards

- **Privacy Compliance**: Info.plist must include explicit, polished user descriptions for:
  - `NSPhotoLibraryUsageDescription`: "ANASTARS requires photo access to attach tattoo reference images to your booking inquiry."
  - `NSCameraUsageDescription`: "ANASTARS uses the camera to capture reference sketches or daily healing progress photos."
- **Apple Pay / In-App Purchases**: Tattoo bookings and deposits are categorized under **physical personal services**, strictly exempt from Apple 30% IAP commission (covered under Apple Guidelines 3.1.3(e) - Goods and Services Outside the App). Standard ЮKassa web redirect / SberPay is fully compliant.
- **Haptic Restraint**: Haptic triggers are restricted to purposeful micro-interactions (snapping a slider, selecting a calendar day, tapping confirm) — never continuous or jarring vibrations.
