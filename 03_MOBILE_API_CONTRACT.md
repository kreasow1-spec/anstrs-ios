# ANASTARS PERSONAL TATTOO
# MOBILE API CONTRACT & SPECIFICATION

> **DOCUMENT ID:** `03_MOBILE_API_CONTRACT.md`  
> **READ PRIORITY:** **4TH**  
> **BASE URL:** `https://anastars-tattoo.ru/api/v1` (Production) / `http://localhost:3000/api/v1` (Local Dev)  
> **SOURCE OF TRUTH:** `server/mobile-api.ts`  
> **STATUS:** PRODUCTION-VERIFIED (PHASE 1 & 1.5 PASSED)

---

## 1. Global Conventions & Protocol Rules

### 1.1 Headers
| Header | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `Content-Type` | Yes (for POST/PUT) | Standard JSON mime type | `application/json` |
| `Authorization` | Conditional | Bearer JWT token obtained from auth endpoints | `Bearer eyJhbGciOi...` |
| `X-Client-Token` | Optional | Cryptographic random token for guest booking access | `4f9a1b...` |
| `Accept` | Yes | MIME type | `application/json` |

### 1.2 Unified Error Response Model
All errors return consistent JSON:
```json
{
  "error": "Человекочитаемое описание ошибки на русском языке",
  "code": "MACHINE_READABLE_ERROR_CODE",
  "details": null
}
```

Standard HTTP Error Codes:
- `400 Bad Request`: Validation failure, missing required fields (`MISSING_FIELDS`, `VALIDATION_ERROR`).
- `401 Unauthorized`: Missing or invalid token (`INVALID_CREDENTIALS`, `AUTH_REQUIRED`).
- `403 Forbidden`: IDOR protection or insufficient privileges (`IDOR_FORBIDDEN`, `ADMIN_REQUIRED`, `REVIEW_NOT_ELIGIBLE`).
- `404 Not Found`: Entity not found (`NOT_FOUND`, `BOOKING_NOT_FOUND`).
- `409 Conflict`: Slot already booked by another user (`SLOT_CONFLICT`).
- `413 Payload Too Large`: Upload exceeds 15 MB limit (`PAYLOAD_TOO_LARGE`).
- `415 Unsupported Media Type`: Magic bytes do not match JPEG/PNG/WEBP/GIF (`UNSUPPORTED_MEDIA_TYPE`).
- `429 Too Many Requests`: Rate limit threshold exceeded (`RATE_LIMIT_EXCEEDED`).
- `500 Internal Server Error`: Unhandled server exception.

### 1.3 Pagination Standard
Endpoints supporting pagination return:
```json
{
  "items": [ ... ],
  "total": 42,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

---

## 2. Exhaustive Endpoint Specifications

### 2.1 CONFIG & SYSTEM

#### `GET /api/v1/config`
- **Purpose**: Bootstrap mobile app configuration, minimum app version, deposit amount, studio address, and contact links.
- **Auth**: None (Public).
- **Role**: Any.
- **Request**: None.
- **Response (200 OK)**:
```json
{
  "appName": "ANASTARS TATTOO",
  "studioName": "Студия авторской татуировки Анастасии",
  "artistName": "Анастасия",
  "depositAmount": 2000,
  "allowNewBookings": true,
  "isPaymentConfigured": true,
  "paymentProviderName": "yookassa",
  "studioAddress": "Санкт-Петербург, Лиговский проспект",
  "contactTelegram": "https://t.me/anastars_tattoo",
  "contactChannel": "https://t.me/anastarstattoo",
  "reminderBotUsername": "AnastarsStudioBot",
  "minSupportedAppVersion": "1.0.0"
}
```
- **Side Effects**: None.
- **Cache**: 5 minutes on client (or invalidate on foreground resume).

---

### 2.2 AUTHENTICATION & SESSIONS

#### `POST /api/v1/auth/login`
- **Purpose**: Authenticate client via email and password.
- **Auth**: None (Rate limit: 15 req/min).
- **Request Body**:
```json
{
  "email": "client@example.com",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "name": "Елизавета",
    "email": "client@example.com",
    "phone": "+79991234567",
    "role": "client",
    "createdAt": "2026-03-10T12:00:00.000Z"
  }
}
```
- **Errors**: `400 MISSING_CREDENTIALS`, `401 INVALID_CREDENTIALS`.

#### `POST /api/v1/auth/register`
- **Purpose**: Register new client user account.
- **Auth**: None (Rate limit: 10 req/min).
- **Request Body**:
```json
{
  "name": "Елизавета",
  "email": "client@example.com",
  "password": "SecurePassword123!",
  "phone": "+79991234567"
}
```
- **Response (201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "name": "Елизавета",
    "email": "client@example.com",
    "phone": "+79991234567",
    "role": "client",
    "createdAt": "2026-09-18T10:00:00.000Z"
  }
}
```
- **Errors**: `400 MISSING_FIELDS`, `400 USER_EXISTS`.

#### `POST /api/v1/auth/booking-login`
- **Purpose**: Instant 1-step login using booking ID and contact (phone or Telegram username).
- **Auth**: None (Rate limit: 10 req/min).
- **Request Body**:
```json
{
  "bookingId": 142,
  "contact": "+79991234567"
}
```
- **Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "name": "Елизавета",
    "email": "client@example.com",
    "phone": "+79991234567",
    "role": "client",
    "createdAt": "2026-03-10T12:00:00.000Z"
  }
}
```
- **Errors**: `400 MISSING_FIELDS`, `401 INVALID_CREDENTIALS`.

#### `GET /api/v1/auth/me`
- **Purpose**: Fetch profile of currently authenticated user.
- **Auth**: Bearer token required.
- **Response (200 OK)**:
```json
{
  "user": {
    "id": 4,
    "name": "Елизавета",
    "email": "client@example.com",
    "phone": "+79991234567",
    "role": "client",
    "createdAt": "2026-03-10T12:00:00.000Z"
  }
}
```

#### `POST /api/v1/auth/logout`
- **Purpose**: Revoke active session token on server.
- **Auth**: Bearer token (optional; gracefully handles empty header).
- **Response (200 OK)**: `{ "success": true }`

---

### 2.3 PORTFOLIO & SKETCHES

#### `GET /api/v1/portfolio`
- **Purpose**: Catalog of executed tattoo works.
- **Query Params**:
  - `featured` (`boolean`, optional): Only featured works if `true`.
  - `style` (`string`, optional): `microrealism`, `floral`, `gothic`, `tribal`, `calligraphy`, `vintage`, `graphics`, `other`.
  - `limit` (`number`, default `20`, max `100`).
  - `offset` (`number`, default `0`).
- **Response (200 OK)**:
```json
{
  "items": [
    {
      "id": 12,
      "title": "Анатомический пион",
      "style": "floral",
      "size": "medium",
      "bodyPart": "Предплечье",
      "description": "Тонкие линии, градиентная растушевка single-needle.",
      "imageUrl": "/uploads/peony_12.jpg",
      "sketchUrl": "/uploads/peony_sketch_12.jpg",
      "isHealed": true,
      "healedMonths": 6,
      "healedImageUrl": "/uploads/peony_healed_12.jpg",
      "isFeatured": true,
      "sortOrder": 1,
      "createdAt": "2026-02-15T14:30:00.000Z"
    }
  ],
  "total": 35,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

#### `GET /api/v1/portfolio/:id`
- **Response (200 OK)**: Single `PortfolioWork` object.
- **Errors**: `400 INVALID_ID`, `404 NOT_FOUND`.

#### `GET /api/v1/sketches`
- **Purpose**: Catalog of available original sketches and flash designs.
- **Query Params**:
  - `style` (`string`, optional).
  - `status` (`string`, optional): `available`, `reserved`, `sold`.
  - `limit` (`number`, default `20`, max `100`).
  - `offset` (`number`, default `0`).
- **Response (200 OK)**:
```json
{
  "items": [
    {
      "id": 8,
      "title": "Готическая капитель",
      "style": "gothic",
      "description": "Эскиз для размещения на бедре или предплечье.",
      "imageUrl": "/uploads/gothic_arch_8.jpg",
      "status": "available",
      "price": 18000,
      "sortOrder": 2,
      "createdAt": "2026-03-01T10:00:00.000Z"
    }
  ],
  "total": 14,
  "limit": 20,
  "offset": 0,
  "hasMore": false
}
```

#### `GET /api/v1/before-sketch`
- **Purpose**: Pairs showing the initial sketch side-by-side with the final executed tattoo.
- **Response (200 OK)**:
```json
[
  {
    "id": 3,
    "title": "Змей и васильки",
    "style": "graphics",
    "sketchUrl": "/uploads/snake_sketch.jpg",
    "tattooUrl": "/uploads/snake_tattoo.jpg",
    "description": "Трансформация эскиза с адаптацией под изгиб ключицы.",
    "sortOrder": 1,
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
]
```

---

### 2.4 FAQ & REVIEWS

#### `GET /api/v1/faq`
- **Purpose**: List of published studio FAQ questions.
- **Response (200 OK)**: Array of `FaqItem` objects sorted by `sortOrder`.

#### `GET /api/v1/reviews`
- **Query Params**: `featured` (`boolean`, optional), `limit` (`number`, default `20`), `offset` (`number`, default `0`).
- **Response (200 OK)**:
```json
{
  "items": [
    {
      "id": 7,
      "clientName": "Валерия",
      "rating": 5,
      "date": "2026-02-28",
      "text": "Анастасия — невероятный мастер тонких линий. Заживление под пленкой прошло идеально!",
      "tattooStyle": "microrealism",
      "tattooTitle": "Миниатюра ласточки",
      "bodyPart": "Ключица",
      "photoUrl": "/uploads/review_valeria.jpg",
      "verifiedClient": true,
      "isFeatured": true
    }
  ],
  "total": 24,
  "averageRating": 5.0,
  "limit": 20,
  "offset": 0,
  "hasMore": false
}
```

#### `POST /api/v1/reviews`
- **Purpose**: Submit a client review with eligibility gate.
- **Auth**: Optional (if user logged in, credentials taken from session).
- **Eligibility Check**: Non-admin clients MUST match a completed session in `db.bookings` by `userId`, `email`, `phone`, or `bookingId`.
- **Request Body**:
```json
{
  "clientName": "Валерия",
  "rating": 5,
  "text": "Идеально выполненный сеанс!",
  "tattooStyle": "microrealism",
  "tattooTitle": "Миниатюра ласточки",
  "bodyPart": "Ключица",
  "photoUrl": "/uploads/review_valeria.jpg",
  "bookingId": 142
}
```
- **Errors**: `400 VALIDATION_ERROR`, `403 REVIEW_NOT_ELIGIBLE`.

---

### 2.5 BOOKINGS & BUSY SLOTS

#### `GET /api/v1/bookings/busy-slots`
- **Purpose**: Retrieve unavailable dates and slots for the interactive booking calendar.
- **Privacy Rule**: Personal client names, phones, and emails are strictly omitted.
- **Response (200 OK)**:
```json
{
  "busySlots": [
    { "date": "2026-09-22", "isFullDay": true, "reason": "Выходной" },
    { "date": "2026-09-25", "time": "14:00 - 17:00 (День)", "isFullDay": false }
  ],
  "bookedDates": ["2026-09-22"]
}
```

#### `POST /api/v1/bookings`
- **Purpose**: Create a new tattoo booking inquiry and optionally initiate payment.
- **Auth**: Optional (authenticated user ID is automatically linked if present).
- **Request Body**:
```json
{
  "name": "Мария Смирнова",
  "phone": "+79995554433",
  "email": "maria@example.com",
  "telegram": "@marias",
  "idea": "Лунница с переплетенным чертополохом",
  "style": "gothic",
  "size": "medium",
  "bodyPart": "Внутренняя сторона предплечья",
  "hasReference": true,
  "referenceImages": ["/uploads/ref1.jpg", "/uploads/ref2.jpg"],
  "preferredDate": "2026-10-05",
  "preferredTime": "14:00 - 17:00 (День)",
  "sketchId": 8,
  "paymentMethod": "ЮKassa (Онлайн)"
}
```
- **Response (201 Created)**:
```json
{
  "id": 145,
  "name": "Мария Смирнова",
  "phone": "+79995554433",
  "status": "pending",
  "depositAmount": 2000,
  "depositStatus": "pending",
  "clientToken": "a9f8e4b2c1d0...",
  "payment": {
    "id": "pay_982341",
    "provider": "yookassa",
    "amount": 2000,
    "status": "pending",
    "confirmationUrl": "https://yoomoney.ru/checkout/payments/v2/contract?orderId=..."
  }
}
```
- **Errors**: `400 VALIDATION_ERROR`, `403 BOOKINGS_CLOSED`, `409 SLOT_CONFLICT`.

#### `GET /api/v1/bookings`
- **Purpose**: List bookings belonging to the authenticated client (or all for admin).
- **Auth**: Bearer token required (`requireAuth`).
- **Response (200 OK)**: Array of sanitized `Booking` objects (sensitive fields `adminNote` and `clientPassword` removed for clients).

#### `GET /api/v1/bookings/:id`
- **Purpose**: View detailed booking info.
- **IDOR Guard**: Allowed ONLY if:
  - `req.user.id === booking.userId`, OR
  - `req.headers["x-client-token"] === booking.clientToken`, OR
  - `req.user.role === 'admin'`.
- **Errors**: `400 INVALID_ID`, `403 IDOR_FORBIDDEN`, `404 BOOKING_NOT_FOUND`.

---

### 2.6 PAYMENTS & DEPOSITS

#### `POST /api/v1/bookings/:id/payment`
- **Purpose**: Initiate or resume deposit payment via ЮKassa.
- **IDOR Guard**: Requires user ownership or `X-Client-Token`.
- **Idempotency**: If an active pending payment was initiated within the last 60 minutes, it is reused.
- **Request Body**:
```json
{
  "returnUrl": "anastars://payment/success?bookingId=145"
}
```
- **Response (201 Created or 200 OK if reused)**:
```json
{
  "reused": false,
  "payment": {
    "id": "pay_789123",
    "bookingId": 145,
    "provider": "yookassa",
    "amount": 2000,
    "currency": "RUB",
    "status": "pending",
    "confirmationUrl": "https://yoomoney.ru/checkout/payments/v2/contract?orderId=..."
  }
}
```
- **Errors**: `400 ALREADY_PAID`, `400 PAYMENTS_DISABLED`, `403 IDOR_FORBIDDEN`.

#### `GET /api/v1/bookings/:id/payment-status`
- **Purpose**: Query authoritative payment verification from the server (which queries ЮKassa v3 directly).
- **IDOR Guard**: Requires user ownership or `X-Client-Token`.
- **Response (200 OK)**:
```json
{
  "paid": true,
  "depositStatus": "paid",
  "status": "confirmed",
  "payment": {
    "id": "pay_789123",
    "status": "succeeded",
    "amount": 2000,
    "paidAt": "2026-09-18T10:15:00.000Z"
  }
}
```

---

### 2.7 FILE UPLOADS

#### `POST /api/v1/upload`
- **Purpose**: Upload reference photos or client avatars.
- **Auth**: None (Rate limit: 20 req/min).
- **Request Body**:
```json
{
  "filename": "reference_sketch.jpg",
  "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."
}
```
- **Validation**:
  - Max size: **15 MB**.
  - Binary header must match JPEG, PNG, WEBP, or GIF magic bytes.
- **Response (201 Created)**:
```json
{
  "success": true,
  "url": "/uploads/reference_sketch_1726650000_a1b2c3d4.jpg",
  "filename": "reference_sketch_1726650000_a1b2c3d4.jpg",
  "sizeKb": 1240,
  "mimeType": "image/jpeg"
}
```
- **Errors**: `400 EMPTY_FILE`, `413 PAYLOAD_TOO_LARGE`, `415 UNSUPPORTED_MEDIA_TYPE`.

---

### 2.8 HEALING & AFTERCARE

#### `GET /api/v1/healing/:token`
- **Purpose**: Retrieve personal aftercare protocol for a completed tattoo.
- **Auth**: None (Guarded by cryptographic link token).
- **Response (200 OK)**:
```json
{
  "booking": {
    "id": 142,
    "clientName": "Елизавета",
    "healingType": "film",
    "tattooIdea": "Анатомический пион"
  },
  "healingContent": {
    "type": "film",
    "title": "Заживление под специальной пленкой Supresorb-F",
    "goldenRule": "Не сдирайте пленку раньше срока. Скопление жидкости (сукровицы) в первые 48 часов абсолютно нормально.",
    "timeline": [
      {
        "dayRange": "День 1–4",
        "title": "Пленочный барьер",
        "actions": ["Не мочить горячей водой", "Носить свободную одежду"],
        "warnings": ["Не прокалывать пузыри с жидкостью"]
      },
      {
        "dayRange": "День 5",
        "title": "Снятие пленки",
        "actions": ["Распарить под теплым душем", "Стягивать пленку параллельно коже"]
      }
    ]
  }
}
```
- **Errors**: `404 HEALING_LINK_EXPIRED`.

---

### 2.9 DEVICE TOKENS (APNs PUSH GATEWAY)

#### `POST /api/v1/devices/register`
- **Purpose**: Register client APNs device token for push notifications.
- **Auth**: Bearer token required (`requireAuth`).
- **Request Body**:
```json
{
  "deviceToken": "740f4707bebcf74f9b7c25d48e3358945f6aa01da5ddb387462c7eaf61bb78ad",
  "platform": "ios"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "registered": true,
  "deviceToken": "740f4707bebc...",
  "platform": "ios"
}
```
- **Errors**: `400 INVALID_DEVICE_TOKEN`, `401 AUTH_REQUIRED`.
