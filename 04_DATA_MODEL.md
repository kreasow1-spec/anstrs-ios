# ANASTARS PERSONAL TATTOO
# PRODUCTION DATA MODEL & SCHEMA SPECIFICATION

> **DOCUMENT ID:** `04_DATA_MODEL.md`  
> **READ PRIORITY:** **5TH**  
> **SOURCE OF TRUTH:** `src/types.ts`, `server/db.ts`  
> **PERSISTENCE MECHANISM:** Amvera Persistent Volume (`/data/db.json`)  
> **STATUS:** PRODUCTION-VERIFIED (GROUND TRUTH)

---

## 1. Existing Production Database Schema (`db.json`)

The production database is a single structured JSON root object with the following top-level collections:

```typescript
interface DatabaseSchema {
  users: User[];
  sessions: Session[];
  bookings: Booking[];
  payments: PaymentRecord[];
  portfolioWorks: PortfolioWork[];
  sketches: Sketch[];
  beforeSketchPairs: BeforeSketchPair[];
  reviews: Review[];
  faqItems: FaqItem[];
  cmsContent: CMSContent;
  siteSettings: SiteSettings;
  blockedDates: BlockedDate[];
  healingLinks: HealingLinkRecord[];
  telegramOutbox: TelegramOutboxItem[];
  reminderTemplates: ReminderTemplate[];
  reminderLogs: ReminderLog[];
  deviceTokens: DeviceTokenRecord[];
}
```

---

## 2. Exhaustive Entity Breakdown

### 2.1 `User`
- **Purpose**: Authenticated client accounts and administrator identities.
- **Persistence**: `db.users`
- **Ownership**: The user owns their record.
- **Fields**:
  | Field | Type | Req | Description | Mobile Vis |
  | :--- | :--- | :---: | :--- | :---: |
  | `id` | `number` | Yes | Auto-increment primary key (1, 2, ...) | Yes |
  | `name` | `string` | Yes | Client or admin display name | Yes |
  | `email` | `string` | Yes | Unique login email (lowercase) | Yes |
  | `password` | `string` | Yes | PBKDF2-SHA512 hashed string (`hash:salt`) | **NEVER** |
  | `phone` | `string` | No | Formatted mobile phone number | Yes |
  | `role` | `"client" \| "admin"` | Yes | RBAC role | Yes |
  | `createdAt` | `string` (ISO) | Yes | Account creation timestamp | Yes |

---

### 2.2 `Session`
- **Purpose**: Server-side revocable session storage for signed tokens.
- **Persistence**: `db.sessions`
- **Fields**:
  | Field | Type | Req | Description | Mobile Vis |
  | :--- | :--- | :---: | :--- | :---: |
  | `token` | `string` | Yes | HMAC-SHA256 signed JWT | Mobile receives on login |
  | `userId` | `number` | Yes | Foreign key to `users.id` | Internal |
  | `createdAt` | `string` (ISO) | Yes | Token issue timestamp | Internal |
  | `expiresAt` | `string` (ISO) | Yes | Session expiry timestamp | Internal |

---

### 2.3 `Booking`
- **Purpose**: Core appointment inquiry, session specification, and deposit tracking.
- **Persistence**: `db.bookings`
- **Relationships**: `userId -> users.id`, `sketchId -> sketches.id`.
- **Fields**:
  | Field | Type | Req | Description | Mobile Vis |
  | :--- | :--- | :---: | :--- | :---: |
  | `id` | `number` | Yes | Auto-increment primary key | Yes |
  | `userId` | `number` | No | Owner user ID (if authenticated) | Yes |
  | `name` | `string` | Yes | Client contact name | Yes |
  | `phone` | `string` | Yes | Client phone number | Yes |
  | `email` | `string` | No | Client contact email | Yes |
  | `telegram` | `string` | No | Telegram username (`@username`) | Yes |
  | `idea` | `string` | Yes | Brief description of tattoo concept | Yes |
  | `style` | `TattooStyle` | No | `microrealism`, `floral`, `gothic`, etc. | Yes |
  | `size` | `TattooSize` | No | `small`, `medium`, `large`, `sleeve` | Yes |
  | `bodyPart` | `string` | No | Anatomical placement target | Yes |
  | `hasReference` | `boolean` | Yes | Whether inspiration images are attached | Yes |
  | `referenceImages` | `string[]` | No | Relative URLs to uploaded reference images | Yes |
  | `preferredDate` | `string` (YYYY-MM-DD) | No | Target appointment date | Yes |
  | `preferredTime` | `string` | No | Time slot (e.g. `14:00 - 17:00 (День)`) | Yes |
  | `sketchId` | `number` | No | Selected flash sketch ID | Yes |
  | `sketchTitle` | `string` | No | Denormalized title of reserved sketch | Yes |
  | `sketchPrice` | `number` | No | Price of reserved sketch | Yes |
  | `depositAmount`| `number` | Yes | Required deposit (default 2 000 ₽) | Yes |
  | `depositStatus`| `DepositStatus` | Yes | `pending`, `paid`, `cancelled`, `refunded` | Yes |
  | `paymentMethod`| `string` | No | `ЮKassa (Онлайн)`, `СБП (Перевод)` | Yes |
  | `clientToken` | `string` | Yes | Random 32-hex token for guest verification | Yes (`X-Client-Token`) |
  | `clientPassword`| `string` | No | Legacy random password | **NEVER (Filtered)** |
  | `adminNote` | `string` | No | Private studio notes by Anastasia | **NEVER (Admin Only)** |
  | `botRemindersEnabled` | `boolean` | No | Opt-in flag for Telegram reminders | Yes |
  | `botTelegramChatId` | `string \| number` | No | Telegram Chat ID for automated messages | Admin |
  | `reminderChannel` | `"bot" \| "userbot"` | No | Dispatch channel | Admin |
  | `healingType` | `"film" \| "bandage"` | No | Chosen aftercare medical protocol | Yes |
  | `healingLinkToken` | `string` | No | Token for direct web aftercare view | Yes |
  | `customReminderMessages` | `Record<string, string>` | No | Per-booking message overrides | Admin |
  | `status` | `BookingStatus` | Yes | `pending`, `confirmed`, `completed`, `cancelled` | Yes |
  | `createdAt` | `string` (ISO) | Yes | Booking submission timestamp | Yes |

---

### 2.4 `PaymentRecord`
- **Purpose**: Authoritative audit trail for deposit transactions.
- **Persistence**: `db.payments`
- **Fields**:
  | Field | Type | Req | Description | Mobile Vis |
  | :--- | :--- | :---: | :--- | :---: |
  | `id` | `string` | Yes | Internal unique ID (`pay_<random>`) | Yes |
  | `bookingId` | `number` | Yes | Foreign key to `bookings.id` | Yes |
  | `provider` | `"yookassa" \| "mock" \| "disabled"` | Yes | Active gateway | Yes |
  | `providerPaymentId`| `string` | Yes | ЮKassa transaction UUID | Yes |
  | `amount` | `number` | Yes | Total charge in RUB (e.g. 2000) | Yes |
  | `currency` | `"RUB"` | Yes | Currency code | Yes |
  | `status` | `PaymentRecordStatus` | Yes | `pending`, `succeeded`, `canceled` | Yes |
  | `confirmationUrl` | `string` | No | ЮKassa hosted payment checkout URL | Yes |
  | `createdAt` | `string` (ISO) | Yes | Payment initiation timestamp | Yes |
  | `paidAt` | `string` (ISO) | No | Confirmation timestamp from ЮKassa | Yes |

---

### 2.5 `PortfolioWork`
- **Purpose**: Executed tattoos showcase.
- **Persistence**: `db.portfolioWorks`
- **Fields**:
  | Field | Type | Req | Description |
  | :--- | :--- | :---: | :--- |
  | `id` | `number` | Yes | Work ID |
  | `title` | `string` | Yes | Title (e.g. "Анатомический пион") |
  | `style` | `TattooStyle` | Yes | `microrealism`, `floral`, `gothic`, `tribal`, etc. |
  | `size` | `TattooSize` | Yes | `small`, `medium`, `large`, `sleeve` |
  | `bodyPart` | `string` | No | Placement description |
  | `description` | `string` | No | Technical notes & inspiration |
  | `imageUrl` | `string` | Yes | Path to high-res photo (`/uploads/...`) |
  | `sketchUrl` | `string` | No | Path to preliminary sketch photo |
  | `isHealed` | `boolean` | No | Whether the photo shows a healed tattoo |
  | `healedMonths` | `number` | No | Months since session |
  | `healedImageUrl` | `string` | No | Photo of healed skin |
  | `isFeatured` | `boolean` | Yes | Highlighted on home feed |
  | `sortOrder` | `number` | Yes | Integer sort weight |

---

### 2.6 `Sketch`
- **Purpose**: Available and reserved original flash designs.
- **Persistence**: `db.sketches`
- **Fields**:
  | Field | Type | Req | Description |
  | :--- | :--- | :---: | :--- |
  | `id` | `number` | Yes | Sketch ID |
  | `title` | `string` | Yes | Design title |
  | `style` | `TattooStyle` | Yes | Tattoo style |
  | `imageUrl` | `string` | Yes | Sketch image URL |
  | `status` | `"available" \| "reserved" \| "sold"` | Yes | Availability badge |
  | `price` | `number` | No | Estimated execution cost |
  | `sortOrder` | `number` | Yes | Display order |

---

### 2.7 `BeforeSketchPair`
- **Purpose**: Side-by-side transformation pairs.
- **Persistence**: `db.beforeSketchPairs`
- **Fields**:
  | Field | Type | Req | Description |
  | :--- | :--- | :---: | :--- |
  | `id` | `number` | Yes | ID |
  | `title` | `string` | Yes | Pair title |
  | `sketchUrl` | `string` | Yes | Preliminary drawing image |
  | `tattooUrl` | `string` | Yes | Executed tattoo image |
  | `description` | `string` | No | Story of the transformation |

---

### 2.8 `Review`
- **Purpose**: Client reviews and testimonials.
- **Persistence**: `db.reviews`
- **Fields**:
  | Field | Type | Req | Description |
  | :--- | :--- | :---: | :--- |
  | `id` | `number` | Yes | Review ID |
  | `clientName` | `string` | Yes | Display name |
  | `rating` | `number` | Yes | 1 to 5 stars |
  | `text` | `string` | Yes | Review commentary |
  | `tattooStyle` | `string` | No | Style tag |
  | `tattooTitle` | `string` | No | Tattoo title |
  | `photoUrl` | `string` | No | Client photo of healed tattoo |
  | `verifiedClient` | `boolean` | Yes | Verified appointment flag |
  | `isFeatured` | `boolean` | Yes | Pinned review |
  | `isPublished` | `boolean` | Yes | Visibility flag |

---

### 2.9 Other Utility Collections
- **`blockedDates`**: `{ id, date: "YYYY-MM-DD", isFullDay: boolean, timeSlots?: string[], reason?: string }`
- **`faqItems`**: `{ id, category, question, answer, sortOrder, isPublished }`
- **`siteSettings`**: Studio metadata, `depositAmount` (default 2000), `allowNewBookings` (`boolean`).
- **`telegramOutbox`**: Asynchronous message delivery queue.
- **`reminderTemplates`**: Global message templates for the 8 stages.
- **`reminderLogs`**: Execution log of dispatched reminders with status `sent` / `pending`.
- **`deviceTokens`**: APNs device tokens for push notifications.

---

## 3. Future Data Model (PLANNED — NOT In Current Production DB)

> [!WARNING]
> The following entities are **PLANNED FOR LATER PHASES**. They DO NOT currently exist in `db.json` and must NOT be assumed in the backend until explicitly implemented.

### 3.1 `TattooPassport` (PLANNED)
- **Concept**: Digital authenticity certificate for a completed tattoo.
- **Target Fields**: `tattooId`, `bookingId`, `clientId`, `sessionDate`, `completionDate`, `pigmentBatchNumbers`, `needleConfigurations`, `careProtocol`, `studioStamp`.

### 3.2 `BodyMapItem` (PLANNED)
- **Concept**: Vector coordinates linking tattoos to a 2D/3D body mannequin.
- **Target Fields**: `id`, `clientId`, `tattooId`, `coordinates: { x: number, y: number, surface: "front" | "back" }`, `status: "healed" | "in_progress" | "planned"`.

### 3.3 `HealingDiaryEntry` (PLANNED)
- **Concept**: Daily client recovery photos.
- **Target Fields**: `id`, `bookingId`, `dayNumber`, `photoUrl`, `skinCondition: "good" | "itching" | "flaking"`, `notes`.

### 3.4 `ClientMilestone` (PLANNED)
- **Concept**: Loyalty tiers and hours under the needle.
- **Target Fields**: `clientId`, `totalHoursInChair`, `completedProjectsCount`, `tier: "Obsidian" | "Onyx" | "Platinum"`.
