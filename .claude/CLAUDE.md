# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 15 with React 19 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **State**: Zustand with persistence middleware
- **Auth**: Firebase (Email/Password + Google OAuth)
- **HTTP**: Axios with token-aware fetch wrapper

## Architecture

### Directory Structure

```
src/
├── app/           # Next.js App Router pages
├── sections/      # Page-level section components (navbar, dashboard, forms)
├── components/    # Reusable UI components
├── lib/           # Utilities, contexts, API client
│   ├── contexts/  # React contexts (AuthContext)
│   ├── api/       # API client class
│   └── firebase.ts
└── store/         # Zustand stores
```

### Authentication Flow

1. Firebase handles auth (email/password + Google OAuth)
2. `AuthContext` (`src/lib/contexts/AuthContext.tsx`) provides `useAuth` hook
3. `authStore` (Zustand) persists user state with localStorage
4. `authedFetch` (`src/lib/authedFetch.ts`) auto-adds Bearer token and retries on 401

### API Communication

- `authedFetch()` - Wrapper that handles token injection and auto-refresh on 401
- `ApiClient` class (`src/lib/api/api-client.ts`) - Static methods for Gmail/email endpoints

### Key Patterns

- All page components use `"use client"` directive (hooks required)
- Path alias: `@/*` maps to `./src/*`
- Status badges use consistent color coding for job application states
- Firebase config via `NEXT_PUBLIC_*` environment variables

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (default: http://localhost:5000/api)
