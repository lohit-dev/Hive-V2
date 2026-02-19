# Hive - Job Search Mobile App

## Overview

Hive is a job search mobile application built with Expo (React Native) on the frontend and Express.js on the backend. The app features a tab-based navigation with screens for browsing jobs, searching, saving bookmarks, and managing a user profile. It uses a PostgreSQL database with Drizzle ORM for data persistence and TanStack React Query for client-side data fetching/caching.

The project runs as two processes in development: an Expo dev server for the mobile/web frontend and an Express API server on port 5000. In production, the Expo app is built as a static web bundle and served by the Express server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)

- **Framework**: Expo SDK 54 with expo-router v6 for file-based routing
- **Navigation**: Tab-based layout with 5 tabs (Home, Jobs, Search, Saved, Profile) using expo-router's `(tabs)` directory convention
- **Styling**: React Native StyleSheet with a light-mode color system defined in `constants/colors.ts`
- **Fonts**: Inter font family loaded via `@expo-google-fonts/inter`
- **State Management**: TanStack React Query for server state; local React state for UI state
- **Platform Support**: iOS, Android, and Web (with platform-specific adaptations throughout components)
- **Key Libraries**: react-native-gesture-handler, react-native-reanimated, react-native-keyboard-controller, expo-haptics, expo-image
- **iOS 26 Support**: Uses `expo-glass-effect` and unstable native tabs for liquid glass UI when available, falls back to classic tab layout otherwise

### Backend (Express.js)

- **Runtime**: Node.js with TypeScript (compiled via tsx in dev, esbuild for production)
- **Server Entry**: `server/index.ts` — sets up CORS, JSON parsing, and static file serving
- **Routes**: Defined in `server/routes.ts` — all API routes should be prefixed with `/api`
- **Storage Layer**: `server/storage.ts` defines an `IStorage` interface with a `MemStorage` in-memory implementation. This is the data access layer — currently only has user CRUD methods
- **CORS**: Dynamically configured to allow Replit domains and localhost origins for development

### Data Layer

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` — shared between frontend and backend via path aliases (`@shared/*`)
- **Current Schema**: Single `users` table with id (UUID), username, and password fields
- **Validation**: Zod schemas generated from Drizzle schemas via `drizzle-zod`
- **Migrations**: Output to `./migrations` directory, managed via `drizzle-kit push`
- **Database URL**: Configured via `DATABASE_URL` environment variable

### Build & Deployment

- **Development**: Two parallel processes — `expo:dev` for the Expo bundler and `server:dev` for the Express API
- **Production Build**: `expo:static:build` creates a static web bundle via a custom build script (`scripts/build.js`), `server:build` bundles the server with esbuild
- **Production Run**: `server:prod` serves both the API and the static frontend bundle
- **Environment**: Relies on Replit environment variables (`REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`, `EXPO_PUBLIC_DOMAIN`) for URL configuration

### API Communication

- **Client**: `lib/query-client.ts` provides `apiRequest()` helper and `getQueryFn()` factory for TanStack Query
- **Base URL**: Derived from `EXPO_PUBLIC_DOMAIN` environment variable
- **Protocol**: HTTPS with JSON request/response bodies
- **Error Handling**: Throws on non-OK responses with status code and response text

### Project Structure

```
app/                    # Expo Router pages (file-based routing)
  (tabs)/               # Tab navigator screens
    _layout.tsx         # Tab bar configuration
    index.tsx           # Home screen
    jobs.tsx            # Jobs listing
    search.tsx          # Search screen
    bookmarks.tsx       # Saved jobs
    profile.tsx         # User profile
  _layout.tsx           # Root layout (providers)
components/             # Reusable React Native components
constants/              # App constants (colors, etc.)
lib/                    # Client utilities (query client, API helpers)
server/                 # Express backend
  index.ts              # Server entry point
  routes.ts             # API route registration
  storage.ts            # Data access layer
  templates/            # HTML templates for landing page
shared/                 # Shared code between frontend and backend
  schema.ts             # Drizzle database schema + Zod validators
scripts/                # Build scripts
migrations/             # Drizzle database migrations
```

## External Dependencies

- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable. Used with Drizzle ORM for schema management and queries
- **Expo Services**: Expo SDK for mobile development tooling, OTA updates infrastructure
- **Google Fonts**: Inter font family loaded at runtime via `@expo-google-fonts/inter`
- **No authentication service**: Currently no auth implementation — the user schema exists but no login/signup routes are wired up
- **No external APIs**: Job data is currently hardcoded in the frontend components as mock data
