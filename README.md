# ANASTARS iOS HANDOFF PACKAGE

## What This Package Is

This directory (`docs/ios-handoff/`) contains the complete, self-contained, production-verified documentation handoff package for developing the standalone **ANASTARS iOS Mobile Application**.

It bridges the current production website and Node.js backend to the upcoming native iOS client, eliminating ambiguity, preventing false architectural assumptions, and grounding every detail in codebase truth.

---

## Read Order for New AI Session & Engineers

When opening a new session in Google AI Studio or onboarding a new mobile engineer, read the documentation strictly in this sequence:

1. **`00_MASTER_CONTEXT.md`**: Executive identity, current architecture, production facts, hard rules, and document index. *(READ FIRST)*
2. **`01_PRODUCT_SPEC.md`**: Full product vision, 7-stage client lifecycle, and capability classification matrix.
3. **`02_CURRENT_BACKEND.md`**: Technical audit of the Node.js/Express server, JSON database persistence, security, and tests.
4. **`03_MOBILE_API_CONTRACT.md`**: Exhaustive REST contract matching `server/mobile-api.ts` (routes, params, headers, errors, IDOR).
5. **`04_DATA_MODEL.md`**: Existing production DB entities vs. planned future entities.
6. **`05_IOS_ARCHITECTURE.md`**: React Native / Expo architecture, directory tree, caching, storage, and deep links.
7. **`06_DESIGN_SYSTEM.md`**: Dark Gothic Luxury visual tokens, exact color hexes, Syne/Inter typography, and UI primitives.
8. **`07_MOTION_SYSTEM.md`**: Reanimated 3 spring physics presets, gestural interactions, and haptic feedback choreography.
9. **`08_ROADMAP.md`**: 12-phase development roadmap with concrete inputs, outputs, and done criteria.

---

## Current State

- **Website & CMS**: Fully functional and deployed in production on Amvera.
- **Backend**: Express 4.21 + TypeScript running behind Nginx proxy on port 3000.
- **Database**: Persistent JSON file storage (`/data/db.json` or `/app/data/db.json`).
- **Mobile API**: 16 dedicated `/api/v1/...` REST endpoints built and tested in `server/mobile-api.ts`.
- **Security**: IDOR protected, rate-limited, magic-bytes upload validation, authoritative server-to-server ЮKassa verification.
- **Automated Tests**: 13 test suites, 110 tests passing (100% green).

---

## Critical Rules (Non-Negotiable)

1. **Standalone Repository**: The iOS app must be developed in a **separate repository**. Never mix native mobile build files into the web production repository.
2. **Untrusted Client**: The mobile client is untrusted. All business logic (pricing, busy dates, review eligibility, payment capture) belongs on the server.
3. **No Database Migration**: The production database is JSON on Amvera persistent volume. **Do not migrate to PostgreSQL or set up a secondary database.**
4. **Authoritative Payments Only**: Never trust client-side payment success redirects. Always verify via `GET /api/v1/bookings/:id/payment-status`.
5. **Aesthetic Discipline**: Adhere strictly to **Dark Gothic Luxury** (true blacks, obsidian surfaces, ruby accents, Syne typography). Reject generic purple/blue AI templates.

---

## What is Implemented vs. What is Planned

### Fully Implemented on Backend:
- Catalog & Portfolio (`/api/v1/portfolio`)
- Available Sketches (`/api/v1/sketches`)
- Before / Sketch Transformation Pairs (`/api/v1/before-sketch`)
- Studio FAQ & Info (`/api/v1/faq`, `/api/v1/config`)
- Reviews & Average Rating (`/api/v1/reviews`)
- Busy Slot Availability (`/api/v1/bookings/busy-slots`)
- Booking Inquiries with Reference Photos (`/api/v1/bookings`, `/api/v1/upload`)
- ЮKassa 2 000 ₽ Deposit Payment (`/api/v1/bookings/:id/payment*`)
- 1-Step Booking Login (`/api/v1/auth/booking-login`)
- Authenticated Client Space (`/api/v1/bookings`)
- Dynamic Aftercare Protocol (`/api/v1/healing/:token`)
- APNs Device Token Registration (`/api/v1/devices/register`)

### Planned for iOS Development (Phase 2 onwards):
- Native Expo / React Native App Scaffolding (Phase 2)
- Dark Gothic Luxury UI & Atomic Components (Phase 3)
- Discover Feed & Portfolio Zoom (Phase 4)
- Native Booking Wizard & In-App Payment (Phase 5)
- My Sanctuary Client Space (Phase 6)
- Interactive Daily Healing Tracker (Phase 7)
- Digital Tattoo Passport & Body Map (Phase 8)
- Saved Concept Boards & Wishlist (Phase 9)
- Native Push Notifications (Phase 10)

---

## What Must NEVER Be Changed

- Do not alter existing website routes or frontend code.
- Do not modify production persistence paths (`/data/db.json`).
- Do not activate PostgreSQL without explicit human instruction.
- Do not expose administrative notes or internal passwords to client responses.

---

## How a New AI Session Should Use These Files

1. Upload or paste the contents of `00_MASTER_CONTEXT.md` as the first instruction.
2. Direct the AI agent to follow `08_ROADMAP.md` starting at **Phase 2 (iOS Foundation & Scaffolding)**.
3. Consult `03_MOBILE_API_CONTRACT.md` whenever writing API client code.
4. Consult `06_DESIGN_SYSTEM.md` and `07_MOTION_SYSTEM.md` whenever writing styles or animations.
