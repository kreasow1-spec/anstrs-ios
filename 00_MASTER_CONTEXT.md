# ANASTARS PERSONAL TATTOO
# MASTER CONTEXT & HANDOFF SPECIFICATION

> **DOCUMENT ID:** `00_MASTER_CONTEXT.md`  
> **READ PRIORITY:** **1ST (READ THIS FIRST)**  
> **INTENDED AUDIENCE:** AI Coding Agent / Engineer initiating the new standalone iOS repository in Google AI Studio.  
> **SOURCE REPOSITORY:** `ANASTARS TATTOO Production Website & Backend`  
> **DATE:** September 2026  
> **STATUS:** PRODUCTION-VERIFIED (PHASE 1 & 1.5 PASSED)

---

## 1. Project Identity

### 1.1 What is ANASTARS / ANASTARS TATTOO?
**ANASTARS TATTOO** is the high-end personal brand, digital studio, and tattoo practice of **Анастасия (Anastasia)**, an elite Saint Petersburg tattoo artist specializing in:
- **Microrealism (Микрореализм)**: high-detail botanical, animal, and sculptural miniatures.
- **Floral (Флористика)**: anatomical floral compositions following natural body contours.
- **Gothic & Lettering (Готика и каллиграфия)**: dark ornamental typography and architectural arches.
- **Graphic & Tribal (Графика и трайбл)**: dark cyber-tribal and fine-line geometry.

The studio operates with an uncompromising aesthetic: **Dark Gothic Luxury**, strict medical sterilization standards, bespoke client care, and personal artist-to-client rapport.

### 1.2 What Product is Being Built?
We are building the dedicated native **ANASTARS iOS Mobile Application** ("ANASTARS Personal Tattoo Companion"). 

### 1.3 Why a Standalone iOS App?
The existing website (`web client`) functions effectively for general brand discovery and initial booking inquiries. However, a tattoo is an intimate, long-term personal journey. The native iOS client elevates this relationship into an exclusive, tactile digital ecosystem:
1. **Permanent Personal Sanctuary**: Eliminates link hunting; clients preserve their consultation, custom sketch approvals, deposit confirmations, and healing timeline directly in their pocket.
2. **Authoritative Healing Tracker**: Real-time interactive aftercare (Supresorb-F film vs. classic bandage), day-by-day healing logs, and healing photo journal.
3. **Permanent Tattoo Passport (Архив работ)**: Digital passport containing exact tattoo metadata (date, needles, ink batch, body coordinates, healed photos).
4. **Interactive Body Map**: Visual silhouette showing past tattoos and planned canvas projects.
5. **Direct Channel & Push Reminders**: Critical appointment alarms, preparation tips, and private sketch drops.

---

## 2. Current Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ANASTARS ECOSYSTEM                              │
│                                                                        │
│   ┌────────────────────────┐           ┌───────────────────────────┐   │
│   │ EXISTING WEB CLIENT    │           │ STANDALONE iOS CLIENT     │   │
│   │ React 18 + Vite 6      │           │ React Native + Expo       │   │
│   │ Tailwind CSS + Motion  │           │ (Separate Repository)     │   │
│   └───────────┬────────────┘           └─────────────┬─────────────┘   │
│               │                                      │                 │
│               │ HTTPS / JSON REST API                │ Bearer Token /  │
│               │                                      │ X-Client-Token  │
│               ▼                                      ▼                 │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │       AMVERA CLOUD RUNTIME (PORT 3000 / NGINX PROXY)           │   │
│   │                                                                │   │
│   │   Express 4.21 + TypeScript Server (server/app.ts)            │   │
│   │   ├── Security: Helmet, Sliding RateLimiter, MagicBytes        │   │
│   │   ├── Auth: HMAC SHA-256 JWT, PBKDF2 Password Hashing         │   │
│   │   ├── Mobile API Router (/api/v1/...) (server/mobile-api.ts)   │   │
│   │   ├── YooKassa Authoritative Verification (server/payments.ts) │   │
│   │   └── CRM Telegram Outbox Daemon (server/telegram-worker.ts)   │   │
│   │                                                                │   │
│   │   Storage: Persistent Volume Mount (/data/ or /app/data/)       │   │
│   │   ├── db.json (Atomic write via .tmp -> rename)                │   │
│   │   └── /uploads (Image uploads, magic bytes verified)           │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Production Source of Truth

| Component | Production Reality (VERIFIED IN CODE) | What is NOT Used / Forbidden Assumptions |
| :--- | :--- | :--- |
| **Hosting Environment** | **Amvera Cloud** running Node.js 22 LTS container behind Nginx reverse proxy on port 3000. | No AWS, no Vercel, no GCP Cloud Run in active production. |
| **Database** | **Persistent JSON file storage** (`/data/db.json` or `/app/data/db.json`) managed via `server/db.ts` with atomic writes (`fs.rename`), file locks, and `mtime`-based candidate selection. | **PostgreSQL IS NOT ACTIVE IN PRODUCTION.** `pg` and `server/pg-adapter.ts` exist as an optional dormant abstraction, but `DATABASE_URL` is empty. **DO NOT MIGRATE OR ATTEMPT DB SWITCHING.** |
| **Media / Uploads Storage** | Local persistent filesystem path `/data/uploads` or `/app/data/uploads` served statically at `/uploads/*`. | No AWS S3, no Cloudinary, no Supabase Storage. |
| **Payment Gateway** | **ЮKassa REST API v3** with server-side authoritative status polling and capture verification. | No Stripe, no PayPal, no unverified client-side status webhooks. |
| **Messaging & CRM** | **Telegram Bot API** (`AnastarsStudioBot`) + optional MTProto Userbot (`telegram` npm) for direct 1-to-1 client messages. | No Twilio, no WhatsApp Business API. |

---

## 4. Existing Functionality (Implemented & Production-Tested)

- **Website Experience:** Dark gothic branding, responsive catalog, interactive before/after sliders, FAQ accordion, booking modal with date/time pickers.
- **Admin Panel (`/admin`):** Comprehensive CMS for portfolio, sketches, before/after pairs, FAQ, calendar schedule blocking, YooKassa transaction logs, Telegram userbot connection, and custom reminder templates.
- **Booking Engine:** Conflict prevention (double-booking guard), dynamic slot availability (`/api/bookings/busy-slots`), reference photo attachments (up to 3 images, 15MB each, validated magic bytes), client tokens (`X-Client-Token`).
- **Payment Lifecycle:** 2 000 ₽ fixed deposit or custom amounts, YooKassa redirect flow, active payment reuse (idempotency within 60 min), server-authoritative status checking (`/api/v1/bookings/:id/payment-status`).
- **Telegram Reminders & CRM:** 8-stage automated reminder lifecycle (`prep_72h`, `confirm_24h`, `morning_2h`, `aftercare_day1`, `aftercare_day4`, `aftercare_day7`, `aftercare_day14`, `review_day30`), template propagation on edit, booking-specific custom message overrides, 1-click direct link generator (`buildTelegramDirectUrl`).
- **Mobile API Layer (`/api/v1/...`):** 16 dedicated REST endpoints designed specifically for mobile clients (see Section 5 below).

---

## 5. Mobile API Quick Map

The dedicated Mobile API routes are mounted under `/api/v1` (implemented in `server/mobile-api.ts`):

```
GET  /api/v1/config                  -> App version, deposit settings, artist bio, contacts
POST /api/v1/auth/login              -> Standard email + password authentication
POST /api/v1/auth/register           -> New client registration
POST /api/v1/auth/booking-login      -> 1-step client login via bookingId + phone/telegram
GET  /api/v1/auth/me                 -> Current user profile (Bearer token required)
POST /api/v1/auth/logout             -> Token invalidation
GET  /api/v1/portfolio               -> Paginated catalog of works with style filter
GET  /api/v1/portfolio/:id           -> Single portfolio work details
GET  /api/v1/sketches                -> Available & reserved sketches with status filter
GET  /api/v1/sketches/:id            -> Single sketch details
GET  /api/v1/before-sketch           -> Before / sketch comparison pairs
GET  /api/v1/faq                     -> Published FAQ items sorted by sortOrder
GET  /api/v1/reviews                 -> Published verified reviews + average rating
POST /api/v1/reviews                 -> Client review submission (session verification guarded)
GET  /api/v1/bookings/busy-slots     -> Real-time blocked dates and unavailable time slots
POST /api/v1/bookings                -> Create booking + optional instant YooKassa initiation
GET  /api/v1/bookings                -> List client bookings (IDOR guarded: only owner's)
GET  /api/v1/bookings/:id            -> Single booking details (IDOR guarded)
POST /api/v1/bookings/:id/payment    -> Initiate or resume deposit payment
GET  /api/v1/bookings/:id/payment-status -> Authoritative payment verification
POST /api/v1/upload                  -> Base64 file upload with magic byte validation
GET  /api/v1/healing/:token          -> Personalized aftercare instructions
POST /api/v1/devices/register        -> Push notification APNs device registration
```

*Full specification: see `03_MOBILE_API_CONTRACT.md`.*

---

## 6. Handoff Index & Documentation Routing

When the new AI Studio session needs information, follow this direct reading route:

| File | Purpose | When AI Should Read It |
| :--- | :--- | :--- |
| **`00_MASTER_CONTEXT.md`** | Executive context, production facts, hard constraints, document map. | **1st: At session start before anything else.** |
| **`01_PRODUCT_SPEC.md`** | Comprehensive product vision, client journeys, and feature readiness status. | When deciding what features belong in Phase 1 vs Future phases. |
| **`02_CURRENT_BACKEND.md`** | Deep technical audit of the Node.js/Express backend, persistence, security, and tests. | When understanding server limits, runtime constraints, or storage. |
| **`03_MOBILE_API_CONTRACT.md`**| Exhaustive API contract (schemas, request/response headers, errors, IDOR rules). | When implementing API client calls, models, and hooks in iOS. |
| **`04_DATA_MODEL.md`** | Complete specification of production database entities vs planned entities. | When creating TypeScript types, DTOs, and state storage in iOS. |
| **`05_IOS_ARCHITECTURE.md`** | React Native/Expo architecture, directory structure, navigation, and offline cache. | When scaffolding and structuring the iOS repository. |
| **`06_DESIGN_SYSTEM.md`** | Dark Gothic Luxury visual tokens, colors, typography, cards, and UI components. | When building screens, components, stylesheets, or layouts. |
| **`07_MOTION_SYSTEM.md`** | Reanimated 3 specs, haptics, spring curves, transitions, and image expansion. | When implementing animations, gestures, and tactile interactions. |
| **`08_ROADMAP.md`** | 12-phase incremental development plan with done criteria and tests. | When planning the sequence of screen and feature development. |
| **`README.md`** | Quick overview, read order, and checklist for new engineers. | Quick orientation and verification checklist. |

---

## 7. Hard Architectural Rules (NON-NEGOTIABLE)

1. **Standalone Repository**: The iOS app is built in an **entirely separate repository**. Do not commit iOS code into this production website repository.
2. **Untrusted Client Principle**: The mobile client is considered **UNTRUSTED**. All business checks (busy slots, pricing, deposit amounts, eligibility for reviews, payment status) must be executed by the backend.
3. **No Client-Side Payment Verification**: Never mark a booking or deposit as paid based on a client query param (e.g. `?status=success`). Always query `GET /api/v1/bookings/:id/payment-status`.
4. **Production DB Stays Untouched**: The production database is **JSON on persistent volume**. Never trigger a database migration, never switch to PostgreSQL, and never create a secondary database.
5. **Preserve Website Production Integrity**: The backend currently serves the production website. Any change must maintain 100% backward compatibility with web clients.
6. **Strict IDOR Enforcement**: Clients can only view or modify their own bookings via JWT `userId` or cryptographically random `X-Client-Token`.
7. **No AI Slop / Generic SaaS UI**: The mobile app must adhere to **Dark Gothic Luxury**: true blacks, deep graphite surfaces, blood-crimson accents, Syne display typography, and physical spring animations.

---

## 8. Implementation Status Matrix

| Feature Domain | Existing Backend API | Mobile API Ready | iOS UI Implemented | Status |
| :--- | :---: | :---: | :---: | :--- |
| **Catalog & Portfolio** | `/api/portfolio` | `/api/v1/portfolio` | ⏳ Pending (Phase 4) | **IMPLEMENTED ON BACKEND** |
| **Sketches Catalog** | `/api/sketches` | `/api/v1/sketches` | ⏳ Pending (Phase 4) | **IMPLEMENTED ON BACKEND** |
| **Before / Sketch Pairs** | `/api/before-sketch` | `/api/v1/before-sketch` | ⏳ Pending (Phase 4) | **IMPLEMENTED ON BACKEND** |
| **FAQ & Studio Info** | `/api/faq`, `/api/cms` | `/api/v1/faq`, `/config` | ⏳ Pending (Phase 3) | **IMPLEMENTED ON BACKEND** |
| **Reviews & Ratings** | `/api/reviews` | `/api/v1/reviews` | ⏳ Pending (Phase 4) | **IMPLEMENTED ON BACKEND** |
| **Slot Availability & Busy Dates** | `/api/bookings/busy-slots` | `/api/v1/bookings/busy-slots` | ⏳ Pending (Phase 5) | **IMPLEMENTED ON BACKEND** |
| **Booking Creation** | `/api/bookings` | `/api/v1/bookings` | ⏳ Pending (Phase 5) | **IMPLEMENTED ON BACKEND** |
| **Reference Photo Upload** | `/api/upload` | `/api/v1/upload` | ⏳ Pending (Phase 5) | **IMPLEMENTED ON BACKEND** |
| **YooKassa Deposit Payment** | `/api/payments/*` | `/api/v1/bookings/:id/payment*` | ⏳ Pending (Phase 5) | **IMPLEMENTED ON BACKEND** |
| **Client Auth (Email/Pass)** | `/api/auth/login` | `/api/v1/auth/login` | ⏳ Pending (Phase 6) | **IMPLEMENTED ON BACKEND** |
| **Client Booking Quick-Login** | `/api/v1/auth/booking-login` | `/api/v1/auth/booking-login` | ⏳ Pending (Phase 6) | **IMPLEMENTED ON BACKEND** |
| **Client Space / My Bookings** | `/api/bookings` (filtered) | `/api/v1/bookings` | ⏳ Pending (Phase 6) | **IMPLEMENTED ON BACKEND** |
| **Interactive Aftercare / Healing**| `/api/v1/healing/:token` | `/api/v1/healing/:token` | ⏳ Pending (Phase 7) | **IMPLEMENTED ON BACKEND** |
| **APNs Push Device Registration**| N/A | `/api/v1/devices/register` | ⏳ Pending (Phase 10)| **IMPLEMENTED (GATEWAY READY)** |
| **Interactive Body Map** | N/A | N/A | ⏳ Pending (Phase 8) | **PLANNED (IOS ONLY / LOCAL)** |
| **Tattoo Digital Passport** | N/A | N/A | ⏳ Pending (Phase 8) | **PLANNED (PHASE 8)** |
| **Healing Photo Diary** | N/A | N/A | ⏳ Pending (Phase 7) | **PLANNED (LOCAL FIRST / PHASE 7)**|
| **Projects & Wishlist Board** | N/A | N/A | ⏳ Pending (Phase 9) | **PLANNED (LOCAL FIRST / PHASE 9)**|
