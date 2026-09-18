# ANASTARS PERSONAL TATTOO
# COMPREHENSIVE PRODUCT SPECIFICATION

> **DOCUMENT ID:** `01_PRODUCT_SPEC.md`  
> **READ PRIORITY:** **2ND**  
> **PURPOSE:** Define the end-to-end product vision, the 7-stage client lifecycle, and the functional boundaries between existing capabilities, Phase 1 mobile capabilities, and future horizons.

---

## 1. Product Vision & Core Philosophy

**ANASTARS PERSONAL TATTOO** is not an e-commerce booking catalog. It is a **digital private atelier** and **personal tattoo sanctuary** for clients of artist Anastasia.

Tattooing is a permanent, deeply personal bodily transformation that carries anxiety, anticipation, physical pain, meticulous healing, and lifelong pride. The app bridges the physical and digital world through an unbroken 7-stage lifecycle:

```
[ DISCOVER ] ──► [ BOOK ] ──► [ PREPARE ] ──► [ TATTOO ] ──► [ HEAL ] ──► [ ARCHIVE ] ──► [ RETURN ]
```

---

## 2. The 7-Stage Client Lifecycle

### 1. DISCOVER (Исследование и вдохновение)
The client immerses themselves in the dark luxury visual aesthetic, exploring curated collections of Anastasia’s works:
- **Microrealism**: Examining fine-line details, single-needle shading, and anatomical placement.
- **Before & After / Cover-Up Comparisons**: Interactive dual-layer sliders showing raw sketches transformed into healed ink.
- **Available Flash Sketches**: High-resolution original designs with status badges (`available`, `reserved`, `sold`).
- **Studio Standards & Philosophy**: Transparency regarding medical-grade sterilization (EN 13060 autoclaving, disposable cartridges, barrier film).

### 2. BOOK (Бронирование сеанса)
Frictionless, guided appointment booking designed to collect high-fidelity design briefs:
- **Style & Placement**: Selecting tattoo style, approximate size (`small`, `medium`, `large`, `sleeve`), and target body part.
- **Visual References**: Direct upload of up to 3 inspiration images from iOS Photo Library or Camera, validated via magic bytes.
- **Live Schedule Selection**: Browsing interactive calendar with real-time disabled slots (admin blocked dates + booked appointments).
- **Authoritative Deposit**: Seamless 2 000 ₽ deposit payment via ЮKassa (SberPay, Mir, Bank Cards, SBP) with immediate cryptographic confirmation token.

### 3. PREPARE (Подготовка к сеансу)
Preventing session cancellations, fainting, or compromised skin condition:
- **72-Hour Preparation Guide**: Hydration guidelines, blood-thinning medication alerts, alcohol/caffeine restrictions, sleep recommendations.
- **24-Hour Confirmation**: 1-tap appointment confirmation to lock the slot.
- **Day-Of Morning Checklist**: Hearty breakfast reminder, loose dark clothing recommendations, studio address with route launch.

### 4. TATTOO (День сеанса в студии)
In-studio peace of mind:
- **Client Mode**: Clean, dark "Session In Progress" screen showing studio Wi-Fi, playlist mood, tea/coffee options, and session milestones.
- **Digital Consent Confirmation**: Reviewing session specifications and placement sign-off.

### 5. HEAL (Интерактивное заживление)
Mitigating client anxiety during the vulnerable 14–30 day healing window:
- **Dual Healing Trackers**:
  - *Dermal Film (Supresorb-F)*: Days 1–5 film care, lymphatic fluid reassurance ("ichor is normal"), safe film removal guide, Days 6–14 moisturizing and peeling care.
  - *Classic Bandage (Пелёнка)*: 4-hour wash intervals, chlorhexidine rinse, D-Panthenol / Bepanthen application, barrier changes.
- **Interactive Daily Checklist**: Tactile checkboxes for cleaning, hydration, and sun protection.
- **SOS Button**: Immediate direct Telegram link to Anastasia for unexpected inflammation, redness, or accidental film peeling.

### 6. ARCHIVE (Цифровой паспорт татуировки)
Transforming completed tattoos into a permanent digital collection:
- **Tattoo Digital Passport**: Exact session date, needle groupings, ink manufacturer, pigment batch, body placement coordinates.
- **Healed vs Fresh Photos**: Master-uploaded fresh studio shot paired with 1-month and 6-month healed photos.
- **Healing Photo Diary**: Client-saved private recovery photos documenting color settling and skin regeneration.

### 7. RETURN (Возвращение за новой историей)
Nurturing lifelong loyalty:
- **Personal Body Map**: Visual representation of current ink placements and planned projects.
- **Private Flash Drops**: Push notifications for priority sketch releases before general social media publication.
- **Wishlist & Concept Boards**: Saving ideas for future sessions.
- **Verified Reviews**: Submitting verified reviews with photo attachments once healing is complete.

---

## 3. Capability Categorization Matrix

To maintain rigorous engineering honesty, every feature is explicitly classified into one of three scopes:

### A. Existing Capabilities (Production-Tested in Current Backend)
These functions are fully built, tested, and operational in `server/` and `src/`:

| Feature | Backend Endpoint / System | Classification |
| :--- | :--- | :---: |
| Portfolio catalog with style filters | `GET /api/v1/portfolio` | **IMPLEMENTED** |
| Single work detail view | `GET /api/v1/portfolio/:id` | **IMPLEMENTED** |
| Available sketches catalog | `GET /api/v1/sketches` | **IMPLEMENTED** |
| Before / Sketch comparison pairs | `GET /api/v1/before-sketch` | **IMPLEMENTED** |
| Studio FAQ accordion | `GET /api/v1/faq` | **IMPLEMENTED** |
| Client reviews & 5.0 rating calculation | `GET /api/v1/reviews` | **IMPLEMENTED** |
| Review submission with session check | `POST /api/v1/reviews` | **IMPLEMENTED** |
| Real-time busy slots & blocked dates | `GET /api/v1/bookings/busy-slots` | **IMPLEMENTED** |
| Booking creation with deposit calc | `POST /api/v1/bookings` | **IMPLEMENTED** |
| Magic-bytes reference photo upload | `POST /api/v1/upload` | **IMPLEMENTED** |
| YooKassa deposit payment initiation | `POST /api/v1/bookings/:id/payment` | **IMPLEMENTED** |
| Authoritative payment status polling | `GET /api/v1/bookings/:id/payment-status` | **IMPLEMENTED** |
| Client email/password auth | `POST /api/v1/auth/login`, `POST /auth/register` | **IMPLEMENTED** |
| 1-step booking number + contact login | `POST /api/v1/auth/booking-login` | **IMPLEMENTED** |
| Client personal bookings list | `GET /api/v1/bookings` | **IMPLEMENTED** |
| Single booking detail with IDOR guard | `GET /api/v1/bookings/:id` | **IMPLEMENTED** |
| Dynamic healing guide by token | `GET /api/v1/healing/:token` | **IMPLEMENTED** |
| APNs device token registration | `POST /api/v1/devices/register` | **IMPLEMENTED** |
| 8-stage automated reminder daemon | `server/reminders.ts` + `telegram-worker.ts` | **IMPLEMENTED** |

---

### B. Phase 1 Mobile Capabilities (Target for New iOS Session)
These represent the screens and native features to build in the initial iOS release using the existing backend:

| Feature | Scope | Classification |
| :--- | :--- | :---: |
| Dark Gothic Luxury UI Theme & Design System | Native React Native / Expo UI | **IOS ONLY** |
| Tactile Reanimated 3 Spring Gestures & Transitions | Native Reanimated + Gesture Handler | **IOS ONLY** |
| Offline Cache & SecureStore Session Persistence | React Native MMKV + SecureStore | **IOS ONLY** |
| Discover Feed (Portfolio, Sketches, Before/After) | Consumes `/api/v1/portfolio`, `/sketches` | **IOS CONSUMES EXISTING BACKEND** |
| Guided Booking Wizard with Reference Upload | Consumes `/api/v1/upload`, `/bookings` | **IOS CONSUMES EXISTING BACKEND** |
| Native SberPay / YooKassa In-App Web Browser Flow | SafariServices / WebBrowser + ReturnUrl | **IOS CONSUMES EXISTING BACKEND** |
| My Sanctuary (Client Space with Active Booking) | Consumes `/api/v1/bookings/:id` | **IOS CONSUMES EXISTING BACKEND** |
| Dynamic Healing Day-by-Day Interactive Guide | Consumes `/api/v1/healing/:token` + Local | **IOS CONSUMES EXISTING BACKEND** |
| Local Healing Photo Diary (Save photos on device) | Device storage / Camera + MMKV | **IOS ONLY (LOCAL STORAGE)** |
| 1-Tap Studio Support (Telegram Direct Bridge) | Linking to `https://t.me/anastars_tattoo` | **IOS ONLY** |

---

### C. Future Capabilities (Planned Enhancements)
These features represent advanced horizons. They are **NOT** in the production database and will require dedicated schema extensions and backend updates in later roadmap phases:

| Planned Feature | Description | Requirement | Classification |
| :--- | :--- | :--- | :---: |
| **Interactive 3D/2D Body Map** | Interactive canvas marking placed tattoos and future projects. | iOS SVG/Skia canvas + local state | **PLANNED — IOS ONLY (v1)** |
| **Tattoo Digital Passport** | Official certificate with pigments, needles, and serial number. | Backend entity `tattoos` + PDF export | **PLANNED — BACKEND + IOS** |
| **Cloud Healing Photo Sync** | Uploading daily healing photos to server for artist inspection. | Backend storage + gallery endpoints | **PLANNED — BACKEND + IOS** |
| **Private Drop Notifications** | Automated APNs push delivery when a new sketch is published. | Push worker daemon (Apple APNs cert) | **PLANNED — BACKEND + IOS** |
| **In-App Direct Artist Chat** | Native WebSocket chat replacing external Telegram messaging. | WebSocket server + DB chat messages | **PLANNED — BACKEND + IOS** |
| **Loyalty Milestones & Badges** | Rewards, collector tiers (Obsidian, Onyx, Platinum). | Backend loyalty schema + gamification | **PLANNED — BACKEND + IOS** |
| **Cancellation Radar** | Instant notification when a fully booked weekend slot opens up. | Waitlist queue engine in backend | **PLANNED — BACKEND + IOS** |

---

## 4. User Persona Scenarios

### Persona 1: "The First-Timer" (Елизавета, 23 года)
- **Mindset**: Inspired by Anastasia’s floral microrealism on Instagram, but nervous about pain, hygiene, and sketch uniqueness.
- **In-App Experience**:
  1. Opens Discover feed, filters portfolio by `floral` and `microrealism`.
  2. Inspects "Before & After" to verify fine-line longevity on healed skin.
  3. Uses Booking Wizard: uploads 2 reference photos of wild peonies, chooses forearm placement, selects available Saturday afternoon.
  4. Pays 2 000 ₽ deposit securely via SberPay inside the app.
  5. Receives instant confirmation, followed by 72h and 24h preparation cards.
  6. After the session, the app switches to "Healing Mode (Supresorb-F)" with a day-by-day checklist.

### Persona 2: "The Dedicated Collector" (Марк, 29 лет)
- **Mindset**: Has 4 existing tattoos from Anastasia; appreciates dark gothic aesthetics and wants priority access to large-scale flash projects.
- **In-App Experience**:
  1. Logs in with 1 tap via his previous booking reference or phone number.
  2. Views "My Sanctuary" showing his previous completed works.
  3. Receives a push notification: "New Large-Scale Gothic Arch Flash Available".
  4. Reserves the flash sketch before it is posted to public social media.
  5. Tracks his healing progress and leaves an authentic 5-star verified review with photos.
