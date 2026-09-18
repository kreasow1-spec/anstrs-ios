# ANASTARS PERSONAL TATTOO
# CURRENT BACKEND TECHNICAL AUDIT

> **DOCUMENT ID:** `02_CURRENT_BACKEND.md`  
> **READ PRIORITY:** **3RD**  
> **TARGET SYSTEM:** Existing Node.js / Express Backend (`server/`)  
> **STATUS:** PRODUCTION-VERIFIED (CODEBASE GROUND TRUTH)

---

## 1. Technology Stack & Dependencies

All versions and packages are verified directly from `package.json`:

### Production Runtime Dependencies
| Package | Version | Verified Role |
| :--- | :--- | :--- |
| `node` | 22.x LTS | Server runtime environment |
| `express` | `^4.21.2` | Core HTTP framework, JSON routing & middleware pipeline |
| `dotenv` | `^17.2.3` | Environment variable loader (`.env`) |
| `pg` | `^8.23.0` | PostgreSQL client library (dormant in production; active only if `DATABASE_URL` is populated) |
| `telegram` | `^2.26.22` | MTProto Telegram client (GramJS) for Anastasia’s personal userbot |
| `@google/genai` | `^2.4.0` | Google GenAI SDK (used server-side for studio copy and AI logic) |
| `esbuild` | `^0.25.0` | Server bundling engine producing `dist/server.cjs` |
| `react` & `react-dom` | `^19.0.1` | Web frontend UI library served from `/dist` in production |
| `motion` | `^12.23.24` | Animation engine for web UI |
| `lucide-react` | `^0.546.0` | Iconography suite |

### Build & Tooling
- **TypeScript:** `~5.8.2` (`tsconfig.json` enforces strict type checking).
- **Vite:** `^6.2.3` (bundler for web assets).
- **Testing:** `vitest` `^4.1.11` (13 test suites, 110 automated tests).
- **Process execution in dev:** `tsx` `^4.21.0`.

---

## 2. Server Runtime & Infrastructure

### 2.1 Hosting Platform: Amvera Cloud
- The production application runs as a containerized Node.js service on **Amvera Cloud**.
- **Container Port:** Hardcoded to `3000` (`0.0.0.0:3000`).
- **Reverse Proxy:** Incoming external traffic (HTTPS) routes through an internal Nginx proxy to port 3000.
- **Entry Points:**
  - Dev: `tsx server.ts`
  - Production Build: `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`
  - Production Start: `node dist/server.cjs`

### 2.2 Filesystem Persistence & Volume Mounts
Amvera mounts persistent storage to ensure data survives container redeployments and restarts:
- Primary candidate directory: `/data`
- Secondary candidate directory: `/app/data`
- Local dev directory: `./data`

**Persistence Strategy in `server/db.ts`:**
1. `getDataDirectory()` resolves the first writeable persistent directory in the priority list `[/data, /app/data, ./data]`.
2. `getDb()` inspects all candidate paths, checks `fs.statSync(path).mtimeMs`, and selects the file with the most recent modification timestamp to prevent stale state regression.
3. `saveDb()` performs **atomic writes**: serializes JSON, writes to a temporary file (`db.json.<pid>.<timestamp>.tmp`), syncs to disk (`fs.fsyncSync`), and atomically renames (`fs.renameSync`) to `db.json`. In addition, it synchronizes copies across all available persistent paths with isolated try-catch blocks.

---

## 3. Database Architecture: JSON DB vs PostgreSQL

> [!CRITICAL]
> **PRODUCTION REALITY:** The production database is **JSON FILE PERSISTENCE** (`db.json`).  
> PostgreSQL (`server/pg-adapter.ts`) is an optional, dormant fallback layer. **`DATABASE_URL` is empty in production.**  
> Under NO circumstances should the iOS engineer or new AI session attempt to migrate production data or force PostgreSQL activation without explicit human direction.

### Why JSON DB is Sufficient & Safe for Current Scope
- Single-artist boutique studio (Anastasia): ~100–300 active bookings/year, ~50 portfolio items, ~30 sketches.
- The entire database is under 2 MB in memory.
- In-memory querying provides sub-millisecond response times (`< 1ms`).
- In-flight writes are serialized via an internal Promise queue (`writeQueue`) in `server/db.ts` to prevent concurrent write collisions.

---

## 4. Media & Uploads Storage

- **Path:** `path.join(getDataDirectory(), "uploads")` (typically `/data/uploads` or `/app/data/uploads`).
- **Public Serving Route:** `app.use("/uploads", express.static(uploadsDir, { maxAge: "7d" }))`.
- **Upload Ingestion (`POST /api/v1/upload`):**
  - Accepts base64 encoded strings in JSON payload.
  - Hard limit: **15 MB**.
  - **Magic Bytes Inspection:** Inspects binary buffer headers:
    - JPEG: `FF D8 FF`
    - PNG: `89 50 4E 47 0D 0A 1A 0A`
    - GIF: `47 49 46 38`
    - WEBP: `RIFF....WEBP`
  - Files not matching allowed magic bytes are rejected with HTTP 415.
  - Stored filenames are sanitized and assigned random hex suffixes: `${cleanName}_${Date.now()}_${randomBytes(4).toString("hex")}${ext}`.

---

## 5. Authentication & Authorization (RBAC)

### 5.1 Password Security
- Passwords are never stored in plaintext.
- Handled via Node.js native `crypto.pbkdf2Sync`:
  - Algorithm: **PBKDF2-SHA512**
  - Salt: Cryptographically random 16-byte hex per user
  - Iterations: **10,000**
  - Key length: 64 bytes

### 5.2 Session Management & Tokens
- Stateless signed bearer tokens generated via `generateSignedToken(user)`:
  - Header: Base64URL `{ alg: "HS256", typ: "JWT" }`
  - Payload: `{ userId, role, email, name, exp }` (default expiration: 30 days)
  - Signature: HMAC-SHA256 using `SESSION_SECRET` (fallback to stable server secret if env unset).
- Tokens are passed via standard HTTP header: `Authorization: Bearer <token>`.
- In addition, an active session record is stored in `db.sessions` for immediate revocation on `POST /api/v1/auth/logout`.

### 5.3 Alternative Auth: Client Booking Login
- For clients without registered accounts, `POST /api/v1/auth/booking-login` allows instant 1-step sign-in:
  - Input: `bookingId` + `contact` (phone or Telegram username).
  - Matches against existing booking in `db.bookings`.
  - Automatically provisions or resolves a client account and returns a valid session token.

### 5.4 RBAC Enforcement
- `extractUser`: Extracts and verifies the token without blocking unauthenticated requests.
- `requireAuth`: Rejects unauthenticated requests with HTTP 401 (`AUTH_REQUIRED`).
- `requireAdmin`: Rejects non-admin users (`user.role !== 'admin'`) with HTTP 403 (`ADMIN_REQUIRED`).

---

## 6. Payment Engine (ЮKassa Integration)

Implemented in `server/payments.ts`:
- **Provider:** ЮKassa REST API v3 (`https://api.yookassa.ru/v3/payments`).
- **Credentials:** `YOOKASSA_SHOP_ID` + `YOOKASSA_SECRET_KEY` (configured via env variables).
- **Deposit Policy:** Standard deposit is **2 000 ₽** (configurable in CMS `siteSettings.depositAmount`).
- **Idempotency:**
  - `POST /api/v1/bookings/:id/payment` reuses existing pending payment records created within the last 60 minutes.
  - Outgoing requests to ЮKassa use unique `Idempotence-Key: ${bookingId}_${depositAmount}_${Date.now()}` headers.
- **Strict Verification Gate:**
  - Status updates are **never** accepted from client-side redirects.
  - When `GET /api/v1/bookings/:id/payment-status` is called, the server executes a direct server-to-server request to ЮKassa (`GET /v3/payments/{providerPaymentId}`).
  - When ЮKassa returns `status: "succeeded"`, the server updates `payment.status = "succeeded"`, sets `booking.depositStatus = "paid"`, and flags `booking.status = "confirmed"`.

---

## 7. Telegram Messaging & Reminders Lifecycle

### 7.1 Outbox Queue Architecture (`server/telegram-worker.ts`)
- To prevent network latency from blocking HTTP requests, all outgoing Telegram messages are queued into `db.telegramOutbox`.
- Background daemon polls every 10 seconds:
  - Checks pending items with `attempts < 3`.
  - Sends via official Bot API (`https://api.telegram.org/bot<TOKEN>/sendMessage`).
  - Supports markdown formatting and HTML fallback.
  - Increments exponential backoff on network failures.

### 7.2 8-Stage Automated Reminders (`server/reminders.ts`)
The server runs an automated reminder cycle every 15 minutes:
1. `prep_72h`: 3 days before session — comprehensive preparation advice.
2. `confirm_24h`: 1 day before session — interactive confirmation request.
3. `morning_2h`: 2 hours before session — arrival instructions, address, tea/coffee.
4. `aftercare_day1`: 24h after session — initial wash & film care guidelines.
5. `aftercare_day4`: 4 days after session — film removal & moisturizing phase.
6. `aftercare_day7`: 7 days after session — peeling phase & anti-itch instructions.
7. `aftercare_day14`: 14 days after session — skin renewal and SPF protection.
8. `review_day30`: 30 days after session — invitation to submit a healed tattoo review.

### 7.3 Dynamic Custom Message Overrides
- When an admin customizes a message for a specific booking via `PUT /api/reminders/custom-message`, it is saved in `booking.customReminderMessages[templateId]`.
- The dispatcher strictly prioritizes:
  `Client Custom Message` > `Admin Edited Template` > `Hardcoded Default Fallback`.

---

## 8. Rate Limiting & Security Defenses

- **In-Memory Sliding Window:** `rateLimit(maxRequests, windowMs)` tracks client IP / `X-Forwarded-For`.
  - Auth endpoints (`/auth/login`, `/auth/booking-login`): **10 requests / minute**.
  - Review submissions: **10 requests / minute**.
  - Booking creations: **15 requests / minute**.
  - Payment initiation: **30 requests / minute**.
- **IDOR Protection:**
  - Detail and payment endpoints (`GET /api/v1/bookings/:id`) verify that `req.user.id === booking.userId` OR header `X-Client-Token === booking.clientToken` OR `req.user.role === 'admin'`.
  - Regular clients never receive internal `adminNote` or legacy `clientPassword` fields.
- **Content Security & HTTP Headers:** Configured via `helmet` (HSTS, No-Sniff, Frameguard).

---

## 9. Test Suite Verification

- **Command:** `npx vitest run`
- **Results:**
  - **13 Test Suites Passed** (100%)
  - **110 Tests Passed** (0 failed, 0 skipped)
  - Key suites:
    - `server/__tests__/security_audit_phase1_5.test.ts` (IDOR, auth, payment verification)
    - `server/__tests__/mobile_api.test.ts` (Mobile contract validation)
    - `server/__tests__/reviews_reminders.test.ts` (Review eligibility, 8-stage reminder schedules)
    - `server/__tests__/payments.test.ts` (ЮKassa flow & status polling)
