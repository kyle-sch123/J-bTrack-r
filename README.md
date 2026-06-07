# Job Application Tracker — Frontend

Next.js 15 (App Router) + React 19 + TypeScript client for the JobTrackerApi
backend. Provides a landing page, Firebase-based auth, a job-applications
dashboard, a CRUD form for applications, and a Gmail-integration settings
page.

> Known issues and gaps are tracked in [`./Issues.md`](./Issues.md).

---

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15.4.5 (App Router) |
| UI | React 19, Tailwind CSS 4 (via `@tailwindcss/postcss`) |
| Language | TypeScript (`strict: true`) |
| Auth | Firebase Web SDK 12 (email/password + Google popup) |
| State | Zustand 5 with `persist` middleware + a parallel React Context |
| HTTP | `fetch` wrapped in a token-injecting helper (`authedFetch`) |
| Icons | `lucide-react` |
| Animations | `@lottiefiles/dotlottie-react` |
| Build | Next CLI, ESLint (`eslint-config-next`) |

Path alias: `@/*` → `./src/*` (see `tsconfig.json`).

---

## Scripts

```bash
npm run dev      # next dev — http://localhost:3000
npm run build    # next build
npm run start    # next start
npm run lint     # next lint
```

---

## Project layout

```
src/
├── app/                              # App Router pages
│   ├── layout.tsx                    # Root layout — wraps everything in <AuthProvider>
│   ├── page.tsx                      # Marketing landing page
│   ├── globals.css                   # Tailwind import + CSS variables
│   ├── auth/page.tsx                 # Sign-in / sign-up / password reset
│   ├── dashboard/page.tsx            # Renders <DashboardSection> + <JobApplicationForm>
│   └── settings/page.tsx             # Gmail integration (connect / disconnect / status)
│
├── sections/                         # Page-level composite components
│   ├── navbar.tsx                    # Top nav + profile dropdown + mobile menu
│   ├── heroSection.tsx               # Landing hero (animated, marketing copy)
│   ├── footer.tsx                    # Landing footer + newsletter form (local-only)
│   ├── dashboard.tsx                 # Metrics + status overview + recent applications
│   └── JobApplicationForm.tsx        # CRUD modal + filter/search + list; includes <ReviewQueue>
│
├── components/                       # Reusable UI bits
│   ├── featuresCard.tsx              # Card / CardHeader / CardTitle / … (used by landing)
│   ├── ReviewQueue.tsx               # Pending-AI-extraction review list
│   ├── statusBadge.tsx               # Color-coded status pill
│   └── metricCard.tsx                # ⚠ Unused — dashboard renders its own cards inline
│
├── lib/
│   ├── firebase.ts                   # Idempotent firebase/app init + exports `auth`
│   ├── authedFetch.ts                # fetch wrapper: adds Bearer token, refreshes on 401
│   ├── contexts/AuthContext.tsx      # React Context with { user, loading, getToken }
│   └── api/api-client.ts             # ⚠ Unused — alt HTTP client targeting non-existent routes
│
├── store/
│   └── authStore.ts                  # Zustand store (persist) — { user, uid, … }
│
└── assets/
    ├── images/                       # Logos, screenshot
    ├── animations/                   # Lottie JSON / .lottie
    └── icons/                        # (empty)
```

---

## Pages

### `/` — Landing (`src/app/page.tsx`)

Marketing content only: hero + 6-card feature grid + about + 4-step "How
It Works" + footer. All copy is hardcoded (see `Issues.md` re: the
"South Africa's #1", "10k+ users", "4.9★" claims).

### `/auth` — Sign in / Sign up / Password reset (`src/app/auth/page.tsx`)

- Subscribes to `onAuthStateChanged`. When a user appears, writes them to
  the Zustand `authStore` and routes to `/dashboard`.
- Three modes via local state: login, sign-up (with confirm-password
  match), and password reset (`sendPasswordResetEmail`).
- Google: `signInWithPopup(auth, new GoogleAuthProvider())`.

### `/dashboard` — Main app surface (`src/app/dashboard/page.tsx`)

Renders `<Navbar /> <DashboardSection /> <JobApplicationForm /> <Footer />`
in one page. Both children gate their own rendering on `useAuth().user`
(see `Issues.md` — there is no top-level redirect to `/auth` if logged out).

`DashboardSection` (`src/sections/dashboard.tsx`):

- `GET ${API_BASE_URL}/jobapplications?userId=<uid>` via `authedFetch`.
  (The query param is ignored by the backend — kept for legacy reasons.)
- Computes metrics client-side: total, this-week / this-month, average
  "days pending" (since application date), per-status counts, top 2 recent.

`JobApplicationForm` (`src/sections/JobApplicationForm.tsx`):

- `GET /jobapplications` → list, with client-side text + status filtering.
- `POST /jobapplications` — create.
- `PUT /jobapplication/{id}` — update. **⚠ Bug** documented in `Issues.md`:
  body fields are sent in PascalCase, which the backend doesn't read.
- `DELETE /jobapplication/{id}` — delete (with `confirm()` prompt).
- Embeds `<ReviewQueue uid={user} />` to show emails awaiting manual
  approval.

### `/settings` — Gmail integration (`src/app/settings/page.tsx`)

- On mount, `GET /auth/gmail/status`.
- "Connect Gmail Account" → `GET /auth/gmail/connect` → window-redirect to
  the returned `authUrl`.
- "Disconnect" → `POST /auth/gmail/disconnect`.
- Reads `?gmail=connected|error` from the URL (set by the backend's OAuth
  callback redirect) to show success / error toasts.
- Mixes `authedFetch` and raw `fetch` calls (tracked in `Issues.md`).

---

## Authentication & API calls

### Two parallel auth integrations (today)

- **`lib/contexts/AuthContext.tsx`** — `AuthProvider` lives in
  `app/layout.tsx`. Exposes `useAuth() => { user, loading, getToken }`.
  Subscribes to `onAuthStateChanged` and updates `user`/`loading`.
  Also force-refreshes the ID token on every state change (over-eager;
  tracked in `Issues.md`).

- **`store/authStore.ts`** — Zustand store persisted to `localStorage`
  under the key `auth-storage`, holding `{ user, uid }`. Pages (notably
  `/auth` and the `Navbar`) write to it. The two integrations aren't
  formally synchronised; recommendation in `Issues.md` is to keep
  `AuthContext` and shrink the store to `{ uid }`.

### `authedFetch` (`lib/authedFetch.ts`)

```ts
const res = await authedFetch(`${API_BASE_URL}/jobapplications`, {
  method: "POST",
  body: JSON.stringify(payload),
});
```

- Reads `auth.currentUser` and calls `getIdToken(false)` (cached).
- Attaches `Authorization: Bearer …` and a default
  `Content-Type: application/json`.
- On a 401 response, force-refreshes (`getIdToken(true)`) and retries once.

Use `authedFetch` for every backend call. The settings page mixes it with
raw `fetch` — that's an inconsistency to clean up, not a pattern to follow.

### `ApiClient` (`lib/api/api-client.ts`) — ⚠ dead code

A separate `class ApiClient` exists with methods like `syncEmails`,
`getSyncHistory`, `getProcessedEmails`, … targeting routes such as
`/api/emails/sync` and `/api/emails/job-related`. **Those routes do not
exist on the backend.** It also reads `NEXT_PUBLIC_API_URL` while every
page uses `NEXT_PUBLIC_API_BASE_URL`. Slated for deletion (`Issues.md`).

---

## Backend integration

All endpoints assume `${API_BASE_URL}` = `http://localhost:5000/api`
(or your deployed equivalent — note the trailing `/api`).

| Frontend call site | HTTP | Path |
|---|---|---|
| `sections/dashboard.tsx` | GET | `/jobapplications?userId=<uid>` |
| `sections/JobApplicationForm.tsx` | GET | `/jobapplications?userId=<uid>` |
| `sections/JobApplicationForm.tsx` | POST | `/jobapplications` |
| `sections/JobApplicationForm.tsx` | PUT | `/jobapplication/{id}` |
| `sections/JobApplicationForm.tsx` | DELETE | `/jobapplication/{id}` |
| `app/settings/page.tsx` | GET | `/auth/gmail/status` |
| `app/settings/page.tsx` | GET | `/auth/gmail/connect` |
| `app/settings/page.tsx` | POST | `/auth/gmail/disconnect` |
| `components/ReviewQueue.tsx` | GET | `/email-processing/review-queue` |
| `components/ReviewQueue.tsx` | POST | `/email-processing/approve/{id}` |
| `components/ReviewQueue.tsx` | POST | `/email-processing/reject/{id}` |

Backend responses use the C# field casing as declared (mixed camel /
Pascal). The frontend's `JobApplication` TypeScript interface mirrors the
on-the-wire shape — be careful when extending it.

---

## Environment variables

Create `.env.local` at the project root:

```env
# Firebase (client SDK)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<project>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Backend base URL — note the trailing /api
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

`NEXT_PUBLIC_API_URL` (used by the dead `ApiClient`) is **not** needed.

---

## Running locally

```bash
# from frontend/job-application-tracker-frontend
npm install
npm run dev          # http://localhost:3000
```

Make sure the backend is reachable at `NEXT_PUBLIC_API_BASE_URL` and that
the same Firebase project is configured on both sides (the backend
verifies tokens issued by this client).

For the Gmail OAuth round trip to work, the backend's
`GOOGLE_REDIRECT_URI_DEV` must be registered as an authorised redirect URI
on the Google Cloud OAuth client, and `FRONTEND_URL_DEV` on the backend
must point at `http://localhost:3000`.

---

## Known issues

See [`./Issues.md`](./Issues.md) for the full list — highlights:

- ⚠ **Application updates silently lose user edits**
  (`JobApplicationForm.updateApplication` sends PascalCase fields the
  backend ignores).
- ⚠ **Status badges are always grey** (`StatusBadge` switch uses
  lowercase cases against capitalised data).
- ⚠ **`ReviewQueue` reads field names the API doesn't return**
  (`sender`, `body`).
- ⚠ **Dead code**: `lib/api/api-client.ts`, `components/metricCard.tsx`,
  most of the commented-out original implementation at the top of
  `heroSection.tsx`.
- ⚠ **Two parallel auth integrations** (Context + Zustand) that aren't
  formally synchronised.
- ⚠ **`/dashboard` doesn't redirect unauthenticated users** to `/auth`.

---

## Adding pages / sections

- Page-level routes live under `src/app/<route>/page.tsx`. Add
  `"use client"` whenever you use hooks (which is most pages today).
- For shared composites, drop into `src/sections/` and import via
  `@/sections/...`. For small reusable UI, use `src/components/`.
- For backend calls, import `authedFetch` from `@/lib/authedFetch` and
  build `${process.env.NEXT_PUBLIC_API_BASE_URL}/...` URLs.
- For auth state in a component, use `useAuth()` from
  `@/lib/contexts/AuthContext` (preferred) — the Zustand store is fine for
  things the navbar already reads from (`uid`), but try not to spread its
  usage further until the duplication is resolved.
