# ANASTARS PERSONAL TATTOO
# iOS APPLICATION DEVELOPMENT ROADMAP

> **DOCUMENT ID:** `08_ROADMAP.md`  
> **READ PRIORITY:** **9TH**  
> **SCOPE:** Phased Engineering Plan for Standalone iOS App Development  
> **STATUS:** PRODUCTION-VERIFIED (PHASES 0, 1, 1.5 COMPLETED)

---

## Roadmap Overview

```
[ Phase 0: Audit & Architecture ] ──────────────► COMPLETED
[ Phase 1: Mobile API Hardening ] ──────────────► COMPLETED
[ Phase 1.5: Security & IDOR Gate ] ────────────► COMPLETED
                      │
                      ▼
[ Phase 2: iOS Foundation & Expo Scaffolding ]  ◄── START HERE IN NEW SESSION
[ Phase 3: Design System & Atomic UI ]
[ Phase 4: Discover Feed (Portfolio & Sketches) ]
[ Phase 5: Guided Booking & YooKassa Payment ]
[ Phase 6: Client Sanctuary & 1-Step Auth ]
[ Phase 7: Interactive Day-by-Day Healing ]
[ Phase 8: Tattoo Archive & Digital Passport ]
[ Phase 9: Concept Boards & Wishlist ]
[ Phase 10: Native Push Notifications (APNs) ]
[ Phase 11: Loyalty & Advanced Personalization ]
[ Phase 12: App Store Hardening & Submission ]
```

---

## Phase Details

### Phase 0: System Audit & Architecture
- **Status**: **COMPLETED (September 2026)**
- **Goal**: Full technical audit of the existing production website and backend; cataloging persistence reality and limitations.
- **Outputs**: `ANASTARS_IOS_AUDIT_REPORT.md`, `docs/ios-handoff/00_MASTER_CONTEXT.md`.

---

### Phase 1: Backend Mobile API Hardening
- **Status**: **COMPLETED (September 2026)**
- **Goal**: Build and test dedicated mobile REST endpoints under `/api/v1/...`.
- **Outputs**: `server/mobile-api.ts` (16 endpoints), `docs/MOBILE_API_CONTRACT.md`.
- **Tests**: 110 automated tests passing in `vitest`.

---

### Phase 1.5: Security & IDOR Protection Gate
- **Status**: **COMPLETED (September 2026)**
- **Goal**: Verify and enforce strict IDOR authorization, brute-force rate limiters, and authoritative server-side payment checking.
- **Outputs**: `docs/PHASE_1_5_SECURITY_REPORT.md`, `server/__tests__/security_audit_phase1_5.test.ts`.

---

### Phase 2: iOS Foundation & Project Scaffolding
- **Status**: **NEXT STEP (TO BE EXECUTED IN NEW AI STUDIO SESSION)**
- **Goal**: Initialize standalone Expo / React Native project with clean TypeScript configuration, folder structure, and base navigation.
- **Inputs**: `docs/ios-handoff/05_IOS_ARCHITECTURE.md`.
- **Outputs**:
  - Initialized Expo SDK 52+ repository with Expo Router.
  - Configured `@tanstack/react-query`, `zustand`, `react-native-mmkv`, `expo-secure-store`.
  - Type-safe API client (`src/api/client.ts`) with Bearer token interceptor.
  - Root tab layout (`app/(tabs)/_layout.tsx`) with empty screen placeholders.
- **Backend Required**: None (uses existing `/api/v1/config`).
- **iOS Required**: Complete scaffolding and build verification (`npx expo start`).
- **Tests**: Basic unit tests for API client headers and SecureStore wrappers.
- **Done Criteria**: App boots cleanly in iOS simulator; tab switching works with 0 errors.

---

### Phase 3: Design System & Atomic UI Components
- **Status**: **PLANNED (Phase 3)**
- **Goal**: Implement Dark Gothic Luxury design system tokens and reusable atomic components.
- **Inputs**: `docs/ios-handoff/06_DESIGN_SYSTEM.md`, `07_MOTION_SYSTEM.md`.
- **Outputs**:
  - Theme constants (`colors.ts`, `typography.ts`, `spacing.ts`).
  - Core primitives: `GothicButton`, `GothicInput`, `GothicCard`, `StatusBadge`, `GothicHeader`.
  - `expo-image` wrapper with Blurhash placeholders and progressive fading.
  - Spring animation presets (`springs.ts`) and haptic feedback wrappers.
- **Done Criteria**: Component showcase screen renders all variants with exact color contrast and tactile press haptics.

---

### Phase 4: Discover Feed (Portfolio, Sketches, Before/After)
- **Status**: **PLANNED (Phase 4)**
- **Goal**: Build the main public discovery experience connecting clients to Anastasia's work.
- **Inputs**: `/api/v1/portfolio`, `/api/v1/sketches`, `/api/v1/before-sketch`, `/api/v1/reviews`.
- **Outputs**:
  - Filterable masonry portfolio feed with style pills (`microrealism`, `floral`, etc.).
  - Interactive "Before & After" pan slider comparing initial sketches to healed tattoos.
  - Flash sketch catalog with live availability badges (`available`, `reserved`, `sold`).
  - Full-screen pinch-to-zoom image viewer with swipe-down dismissal.
- **Done Criteria**: Offline-cached catalog browsing; smooth 60fps image transitions.

---

### Phase 5: Guided Booking Wizard & YooKassa Deposit Payment
- **Status**: **PLANNED (Phase 5)**
- **Goal**: Create frictionless, guided 4-step booking flow with reference uploads and in-app deposit payment.
- **Inputs**: `/api/v1/bookings/busy-slots`, `/api/v1/upload`, `/api/v1/bookings`, `/api/v1/bookings/:id/payment`.
- **Outputs**:
  - Step 1: Idea, style, size, and anatomical placement.
  - Step 2: Photo reference upload (camera/gallery, compressed base64).
  - Step 3: Interactive calendar with disabled busy dates and occupied slots.
  - Step 4: Summary & deposit payment via SberPay / ЮKassa in-app web browser.
- **Done Criteria**: Real booking successfully created and deposit verified via authoritative status endpoint.

---

### Phase 6: Client Sanctuary & 1-Step Auth
- **Status**: **PLANNED (Phase 6)**
- **Goal**: Provide a private client portal displaying active appointments and consultation history.
- **Inputs**: `/api/v1/auth/booking-login`, `/api/v1/auth/me`, `/api/v1/bookings`.
- **Outputs**:
  - 1-step sign-in using booking ID + phone number.
  - "Upcoming Session" hero card with countdown timer, studio directions, and preparation advice.
  - 1-tap booking confirmation button (locking the slot 24h prior).
  - Direct 1-tap link to Anastasia's personal Telegram.
- **Done Criteria**: Client logs in with 1 tap and views only their own bookings; guest token persisted securely.

---

### Phase 7: Interactive Day-by-Day Healing Tracker
- **Status**: **PLANNED (Phase 7)**
- **Goal**: Real-time aftercare companion mitigating client anxiety during the recovery window.
- **Inputs**: `/api/v1/healing/:token`, local MMKV storage.
- **Outputs**:
  - Selector for healing method: Supresorb-F film vs. Classic Bandage.
  - Day-by-day interactive progress timeline with tactile daily checklists.
  - Emergency SOS guide with direct artist contact for unexpected redness.
  - Local Healing Photo Diary (client takes private daily recovery photos saved on device).
- **Done Criteria**: Checkmarks persist across app restarts; film removal countdown functions correctly.

---

### Phase 8: Tattoo Archive & Digital Passport
- **Status**: **PLANNED (Phase 8)**
- **Goal**: Permanent digital monograph of completed tattoos.
- **Outputs**:
  - Digital Passport card with session details, needle setups, and pigment records.
  - Interactive 2D Body Silhouette marking anatomical tattoo placements.
- **Done Criteria**: Client can flip digital passport card to view technical ink metadata.

---

### Phase 9: Concept Boards & Wishlist
- **Status**: **PLANNED (Phase 9)**
- **Goal**: Client creative workspace for future projects.
- **Outputs**: Saved sketch wishlist, custom moodboards, notes for next consultation.
- **Done Criteria**: Client can save available sketches and draft new ideas offline.

---

### Phase 10: Native Push Notifications (APNs)
- **Status**: **PLANNED (Phase 10)**
- **Goal**: Automated appointment alarms and priority flash drop notifications.
- **Inputs**: `/api/v1/devices/register`, APNs certificates.
- **Outputs**: Push registration on app launch, local scheduled alarms for session day.
- **Done Criteria**: Test push delivered cleanly to iOS simulator / real test device.

---

### Phase 11: Loyalty Milestones & Advanced Personalization
- **Status**: **PLANNED (Phase 11)**
- **Goal**: Rewarding repeat collectors with priority booking and bespoke milestones.
- **Outputs**: Hours under needle counter, collector status badges (Obsidian, Onyx, Platinum).

---

### Phase 12: App Store Submission & Production Hardening
- **Status**: **PLANNED (Phase 12)**
- **Goal**: Final App Store submission, TestFlight beta distribution, and production sign-off.
- **Outputs**: Fastlane build automation, App Store Connect screenshots, privacy policy, and live release.
