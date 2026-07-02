# Wobb — Influencer Discovery

Technical documentation for a client-side influencer search and shortlist application.

**Stack:** React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 4 · React Router 7 · Zustand 5

---
## Vercel Deployment

You can find the deployment here: https://wobb-psi.vercel.app/

---
## Troubleshooting for macOS Users (Apple Silicon)

If you are on an M1/M2/M3 Mac and encounter a macOS security pop-up stating **"rolldown-binding.darwin-arm64.node can’t be opened because Apple cannot check it for malicious software"**, you need to clear the macOS quarantine flag on the downloaded dependencies.

Run the following command in your terminal from the project root:

```bash
xattr -cr node_modules
```

---

## Table of contents

1. [Quick start](#quick-start)
2. [Architecture overview](#architecture-overview)
3. [Project structure](#project-structure)
4. [Routing](#routing)
5. [Data layer](#data-layer)
6. [State management (Zustand)](#state-management-zustand)
7. [Custom hooks](#custom-hooks)
8. [Component architecture](#component-architecture)
9. [Type system](#type-system)
10. [Styling & design system](#styling--design-system)
11. [Performance](#performance)
12. [Accessibility](#accessibility)
13. [Bug fixes (starter → final)](#bug-fixes-starter--final)
14. [Build tooling](#build-tooling)
15. [Assumptions & trade-offs](#assumptions--trade-offs)
16. [Commit history](#commit-history)

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # ESLint flat config
npm run preview  # serve production build locally
```

| Script | What it does |
| ------ | ------------ |
| `dev` | Vite dev server with HMR |
| `build` | Project references TypeScript build + Vite production bundle |
| `lint` | ESLint 10 with `typescript-eslint` + `react-hooks` |
| `preview` | Static preview of `dist/` |

**Path alias:** `@/` → `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

---

## Architecture overview

The app is a **static SPA** with no backend. All influencer data ships as JSON assets. The only runtime persistence is the user's shortlist in `localStorage`.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                 │
├─────────────────────────────────────────────────────────────────┤
│  main.tsx                                                       │
│    └── App (BrowserRouter)                                      │
│          ├── ListStoreHydrator   ← Zustand persist rehydration  │
│          └── AppRoutes (Suspense + lazy routes)                 │
│                ├── SearchPage                                   │
│                ├── SelectedListPage                             │
│                └── ProfileDetailPage                            │
├─────────────────────────────────────────────────────────────────┤
│  Pages (orchestration)                                          │
│    └── Layout → feature components → hooks → services/stores  │
├─────────────────────────────────────────────────────────────────┤
│  Services                    Stores                             │
│  ├── searchService.ts        └── listStore.ts (Zustand+persist) │
│  └── profileService.ts                                          │
├─────────────────────────────────────────────────────────────────┤
│  Static assets                                                  │
│  ├── assets/data/search/{instagram,youtube,tiktok}.json         │
│  └── assets/data/profiles/*.json  (Vite import.meta.glob)       │
└─────────────────────────────────────────────────────────────────┘
```

### Request / data flow

**Search flow**

```
SearchPage
  ├── useState(platform, searchQuery)
  ├── useDeferredValue(searchQuery)          ← non-blocking filter
  ├── useFilteredProfiles(platform, query)
  │     ├── extractProfiles(platform)      ← searchService (cached Map)
  │     └── filterProfiles(profiles, query)
  └── ProfileList → ProfileCard → navigate(ROUTES.profile(...))
```

**Profile detail flow**

```
ProfileDetailPage
  ├── useParams(username)
  ├── usePlatformParam()                     ← ?platform= query string
  └── useProfile(username)
        ├── getCachedProfile()               ← sync cache hit
        └── loadProfileByUsername()          ← import.meta.glob + cache
```

**Add to list flow**

```
AddToListButton
  ├── useIsInList(user_id)                 ← Zustand selector (boolean)
  ├── useAddProfile() / useRemoveProfile()   ← stable action refs
  └── listStore.addProfile(profile, platform)
        └── persist middleware → localStorage
```

---

## Project structure

```
src/
├── app/
│   ├── App.tsx                 # Root: Router + hydrator + routes
│   ├── routes.tsx              # Route table, lazy imports, page transitions
│   └── ListStoreHydrator.tsx   # useListStore.persist.rehydrate() on mount
│
├── pages/                      # Route-level containers (thin)
│   ├── SearchPage.tsx
│   ├── ProfileDetailPage.tsx
│   └── SelectedListPage.tsx
│
├── components/
│   ├── layout/
│   │   ├── Layout.tsx          # Shell: skip link, header, main, footer
│   │   └── ListNavLink.tsx     # Header shortlist link + count badge
│   ├── search/
│   │   ├── PlatformFilter.tsx  # Platform tablist + SearchBar
│   │   └── SearchBar.tsx
│   ├── profile/
│   │   ├── ProfileCard.tsx     # Search result card (memo)
│   │   ├── ProfileList.tsx     # Responsive grid wrapper
│   │   ├── ProfileDetailContent.tsx
│   │   ├── ProfileStatGrid.tsx
│   │   ├── ProfileAvatar.tsx
│   │   ├── ProfileIdentity.tsx
│   │   └── SelectedListItem.tsx
│   ├── list/
│   │   └── AddToListButton.tsx # Toggle add/remove (memo)
│   └── ui/                     # Shared primitives
│       ├── BackLink.tsx
│       ├── EmptyState.tsx
│       ├── PageLoader.tsx
│       ├── ProfileDetailSkeleton.tsx
│       ├── PlatformBadge.tsx
│       ├── PlatformIcon.tsx
│       └── VerifiedBadge.tsx
│
├── hooks/
│   ├── useProfile.ts           # Async profile load + cache integration
│   ├── usePlatformParam.ts     # ?platform= parsing + validation
│   └── useFilteredProfiles.ts  # Memoized extract + filter pipeline
│
├── services/
│   ├── searchService.ts        # Static search JSON, normalize, filter, cache
│   └── profileService.ts       # Dynamic profile JSON via glob, cache, dedupe
│
├── stores/
│   ├── listStore.ts            # Zustand store definition + persist config
│   └── listSelectors.ts        # Granular subscription hooks
│
├── lib/
│   ├── formatters.ts           # Number formatting + buildProfileStats()
│   ├── routes.ts               # Typed route builders
│   ├── animations.ts           # staggerDelay() helper
│   └── platformStyles.ts       # Per-platform Tailwind class maps
│
├── types/
│   ├── platform.ts             # Platform union + guards
│   ├── profile.ts              # UserProfileSummary, SelectedProfile, etc.
│   ├── search.ts               # SearchData, SearchAccount
│   └── index.ts                # Barrel re-exports
│
├── assets/data/                # Static JSON (unchanged from starter)
├── index.css                   # Design tokens, animations, global styles
└── main.tsx                    # createRoot entry
```

### Layer responsibilities

| Layer | Responsibility | May import from |
| ----- | -------------- | --------------- |
| `pages/` | Route params, compose Layout + features, minimal logic | hooks, components, stores |
| `components/` | Presentational + local UI state | hooks, stores, lib, types |
| `hooks/` | Reusable stateful logic | services, types |
| `services/` | Data access, caching, normalization | types, assets |
| `stores/` | Global client state | types |
| `lib/` | Pure utilities (no React) | types |

---

## Routing

Defined in `src/app/routes.tsx` using React Router 7 `Routes` / `Route`.

| Path | Component | Loading |
| ---- | ----------- | ------- |
| `/` | `SearchPage` | Eager (initial route) |
| `/list` | `SelectedListPage` | `React.lazy` + `Suspense` |
| `/profile/:username` | `ProfileDetailPage` | `React.lazy` + `Suspense` |

### URL conventions

```ts
// src/lib/routes.ts
ROUTES.home                              // "/"
ROUTES.list                              // "/list"
ROUTES.profile("cristiano", "instagram") // "/profile/cristiano?platform=instagram"
```

- `username` is URL-encoded via `encodeURIComponent`.
- `platform` query param is read by `usePlatformParam()` and validated with `isPlatform()`.
- Invalid/missing platform defaults to `"instagram"` for add-to-list actions; display label shows `"unknown"`.

### Page transitions

`AppRoutes` keys a wrapper `div` on `location.pathname` with `animate-fade-in-up` for route-change animation.

---

## Data layer

### Search data (`searchService.ts`)

**Source:** Bundled JSON imports (tree-shaken per platform at build time).

```ts
const platformData: Record<Platform, SearchData> = {
  instagram: instagramData,
  youtube: youtubeData,
  tiktok: tiktokData,
};
```

**`extractProfiles(platform)`**

1. Check `profilesByPlatform` in-memory `Map` (session cache).
2. Map `accounts[].account.user_profile` from raw JSON.
3. **Normalize** each profile:

```ts
username: profile.username ?? profile.handle ?? profile.user_id
```

This fixes YouTube entries that omit `username` but provide `handle` (e.g. `VladandNiki`).

**`filterProfiles(profiles, query)`**

- Trims and lowercases query.
- Case-insensitive `includes` on `username` and `fullname`.
- Returns original array reference when query is empty (no alloc).

### Profile detail data (`profileService.ts`)

**Source:** Vite `import.meta.glob` over `src/assets/data/profiles/*.json`.

At module init, builds `profileLoadersByKey: Map<lowercaseFilename, loaderFn>`.

**`loadProfileByUsername(username)`**

```
1. cacheKey = username.toLowerCase()
2. if profileCache.has(cacheKey) → return cached (including null for 404)
3. if inflightRequests.has(cacheKey) → return same Promise (dedupe)
4. else fetch via dynamic import, store in cache, return
```

**`getCachedProfile(username)`** — synchronous read for `useProfile` to skip loading state on revisits.

### Available detail profiles

Only usernames with a matching JSON file under `src/assets/data/profiles/` load successfully:

`cristiano`, `instagram`, `khaby.lame`, `mrbeast`, `MrBeast6000`, `tseries`

All other usernames render the not-found UI.

### Data shapes

```ts
// Search list item (summary)
interface UserProfileSummary {
  user_id: string;
  username: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;  // decimal, e.g. 0.01214 = 1.214%
  handle?: string;
  avg_views?: number;
}

// Persisted shortlist entry
interface SelectedProfile {
  user_id: string;
  username: string;
  fullname: string;
  picture: string;
  platform: Platform;
  followers: number;
  is_verified: boolean;
}
```

---

## State management (Zustand)

### Store: `useListStore`

```ts
interface ListState {
  items: SelectedProfile[];
  hasHydrated: boolean;
  addProfile(profile, platform): boolean;  // returns false if duplicate
  removeProfile(userId): void;
  clearList(): void;
  isInList(userId): boolean;
  setHasHydrated(value): void;
}
```

### Persistence config

| Option | Value |
| ------ | ----- |
| `name` | `"wobb-selected-profiles"` |
| `partialize` | `{ items }` only — actions are not serialized |
| `onRehydrateStorage` | sets `hasHydrated: true` |

### Hydration (`ListStoreHydrator`)

On mount:

```ts
useListStore.persist.onFinishHydration(() => setHasHydrated(true));
void useListStore.persist.rehydrate();
```

`ListNavLink` waits for `hasHydrated` before showing count badge to avoid flash of `(0)`.

### Selector pattern (`listSelectors.ts`)

Granular hooks prevent unnecessary re-renders:

```ts
useIsInList(userId)    // boolean — only re-renders when membership flips
useListCount()           // number
useListItems()           // SelectedProfile[]
useAddProfile()          // stable function reference
useRemoveProfile()
useClearList()
useHasHydrated()
```

**Anti-pattern avoided:** returning `{ addProfile, removeProfile }` as a new object from a single selector (causes re-render on any store change).

### Duplicate policy

Duplicates are blocked by **`user_id`**, not `username`. Same creator on Instagram vs TikTok has different `user_id` values and can both be saved.

---

## Custom hooks

### `useProfile(username)`

Returns `{ user, isLoading, notFound }`.

| State | Condition |
| ----- | --------- |
| `isLoading` | `username` defined and no resolved data yet |
| `notFound` | resolved with `data === null` (no JSON file) |
| `user` | `data.data.user_profile` |

**Race safety:** `useEffect` cleanup sets `cancelled = true` so stale responses are ignored.

**Cache integration:** `resolvedState` prefers `getCachedProfile()` synchronously before network-less dynamic import resolves.

### `usePlatformParam()`

Reads `?platform=` from `useSearchParams()`, validates with `isPlatform()`, returns:

```ts
{ platform: Platform; platformLabel: string }
```

### `useFilteredProfiles(platform, searchQuery)`

```ts
const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
const filteredProfiles = useMemo(
  () => filterProfiles(allProfiles, searchQuery),
  [allProfiles, searchQuery]
);
```

Used with `useDeferredValue(searchQuery)` in `SearchPage` so typing stays responsive.

---

## Component architecture

### Page → Layout → Feature pattern

```
ProfileDetailPage
  └── Layout (title, description)
        ├── BackLink
        └── ProfileDetailContent
              ├── ProfileAvatar (priority)
              ├── PlatformBadge
              ├── ProfileStatGrid → StatCard[]
              └── AddToListButton
```

### Key component notes

| Component | Memo | Notes |
| --------- | ---- | ----- |
| `ProfileCard` | `memo` | `role="button"`, keyboard Enter/Space, stops propagation on list button |
| `AddToListButton` | `memo` | `aria-pressed`, pop animation on add via `useRef` transition tracking |
| `SelectedListItem` | `memo` | Exit animation via `isExiting` + `onAnimationEnd` before `removeProfile` |
| `PlatformFilter` | `memo` | `role="tablist"` / `role="tab"` / `aria-selected` |
| `ProfileList` | `memo` | `grid-cols-1 lg:grid-cols-2`, semantic `<ul role="list">` |

### Formatters (`lib/formatters.ts`)

| Function | Behaviour |
| -------- | --------- |
| `formatFollowers(n)` | `≥1M → X.XM`, `≥1K → X.XK`, else `toLocaleString()` |
| `formatEngagementRate(r)` | `undefined → "N/A"`, else `(r * 100).toFixed(2)%` |
| `buildProfileStats(user)` | Builds conditional stat array for detail grid |

> **Starter bug:** engagement rate was multiplied by `10000` instead of `100`. Fixed to use `formatEngagementRate`.

---

## Type system

Types are split by domain and re-exported from `src/types/index.ts`:

```
types/
├── platform.ts   → Platform, PLATFORMS, isPlatform(), getPlatformLabel()
├── profile.ts    → UserProfileSummary, FullUserProfile, SelectedProfile, ProfileDetailResponse
└── search.ts     → SearchData, SearchAccount
```

`isPlatform()` is a TypeScript type guard:

```ts
function isPlatform(value: string | null | undefined): value is Platform
```

Enables safe narrowing without casting at route boundaries.

---

## Styling & design system

### Tailwind CSS 4

Configured via `@tailwindcss/vite` plugin. Custom tokens in `src/index.css`:

```css
@theme {
  --font-sans: "Inter", system-ui, ...;
  --color-brand: #6366f1;
  --color-brand-hover: #4f46e5;
  --color-brand-muted: #eef2ff;
  --color-surface: #ffffff;
  --color-page: #f8fafc;
  --color-ink: #0f172a;
  --shadow-card: ...;
  --radius-card: 1rem;
}
```

### Utility classes

| Class | Purpose |
| ----- | ------- |
| `.surface-card` | White card with border + shadow |
| `.surface-panel` | Larger rounded panel (search filters) |
| `.interactive-lift` | Hover translate + shadow |
| `.interactive-button` | Transition for buttons |
| `.skeleton` | Shimmer loading placeholder |
| `.animate-fade-in-up` etc. | Entrance / exit animations |

### Platform theming (`lib/platformStyles.ts`)

Per-platform Tailwind class sets for pills and badges:

```ts
PLATFORM_STYLES.instagram → rose accent
PLATFORM_STYLES.youtube   → red accent
PLATFORM_STYLES.tiktok    → cyan accent
```

### Responsive breakpoints

| Breakpoint | Behaviour |
| ---------- | ----------- |
| default | Single-column cards, stacked profile hero |
| `sm:` | Horizontal profile layouts, side-by-side actions |
| `lg:` | 2-column profile grid on search page |
| `lg:` (stats) | Up to 4-column stat grid |

### Typography

Inter loaded from Google Fonts in `index.html`. Fallback: system UI stack.

---

## Performance

| Technique | Location | Effect |
| --------- | -------- | ------ |
| Session cache for search profiles | `searchService` `Map` | Avoid re-parsing JSON on every keystroke |
| Profile memory cache | `profileService` `Map` | Instant revisit to same profile |
| In-flight request dedupe | `profileService` `inflightRequests` | One fetch per username concurrent |
| `useDeferredValue` | `SearchPage` | Input doesn't block on filter |
| `useMemo` | `useFilteredProfiles`, `buildProfileStats` | Avoid redundant computation |
| `React.memo` | Cards, filters, list items | Skip re-render when props equal |
| Granular Zustand selectors | `listSelectors.ts` | Components subscribe to slices |
| Stable action selectors | `useAddProfile()` etc. | No re-render from new function refs |
| `React.lazy` | `ProfileDetailPage`, `SelectedListPage` | Code splitting |
| `loading="lazy"` | `ProfileAvatar` in lists | Defer off-screen images |
| `fetchPriority="high"` | Detail page avatar | Prioritize LCP image |

### Bundle output (approximate)

```
index.js          ~268 KB (gzip ~86 KB)   ← app shell + SearchPage
ProfileDetailPage ~7 KB  (gzip ~2 KB)    ← lazy chunk
SelectedListPage  ~4 KB  (gzip ~1.6 KB)  ← lazy chunk
profile JSON      85–184 KB each        ← lazy per username
search JSON         bundled in index      ← all platforms
```

---

## Accessibility

| Feature | Implementation |
| ------- | -------------- |
| Skip link | `.skip-link` → `#main-content` |
| Focus visible | `:focus-visible` outline on interactive elements |
| Search label | `sr-only` label + `aria-label` on input |
| Platform filter | `role="tablist"`, `aria-selected` on tabs |
| Live regions | `aria-live="polite"` on result counts |
| List button | `aria-pressed` reflects saved state |
| Remove buttons | `aria-label` with profile name |
| Verified badge | `aria-label="Verified account"` |
| Images | Meaningful `alt` from `fullname` |
| Keyboard | Profile cards activatable via Enter/Space |
| Motion | `@media (prefers-reduced-motion: reduce)` disables animations |

---

## Bug fixes (starter → final)

| # | Symptom | Root cause | Fix |
| - | ------- | ---------- | --- |
| 1 | Engagement rate ~100× too large | `engagement_rate * 10000` | `formatEngagementRate` uses `* 100` |
| 2 | "Engagements" showed a percentage | Wrong field bound in JSX | Bind `user.engagements` through `formatFollowers` |
| 3 | Stale profile on fast navigation | No request cancellation / username guard | `useProfile` cancellation flag + username-keyed state |
| 4 | Search missed case variants | `username.includes(query)` case-sensitive | Lowercase both sides |
| 5 | `/profile/MrBeast6000` 404 | Case-sensitive glob path | Lowercase key map for loaders |
| 6 | YouTube cards showed `@undefined` | Missing `username` in JSON | `normalizeProfile` fallback chain |
| 7 | `filterProfiles` could throw | `undefined.includes()` | Normalization before filter |
| 8 | Duplicate formatter logic | Copy-paste in components | Centralized `lib/formatters.ts` |
| 9 | Tab index stale closure | `setClickCount(clickCount + 1)` | Removed debug counter entirely |

---

## Build tooling

### Vite (`vite.config.ts`)

```ts
plugins: [react(), tailwindcss()]
resolve.alias: { "@": "./src" }
```

### TypeScript (`tsconfig.app.json`)

- `moduleResolution: "bundler"`
- `verbatimModuleSyntax: true`
- `noUnusedLocals` / `noUnusedParameters`
- Path mapping: `@/*` → `./src/*`

### ESLint (`eslint.config.js`)

Flat config with:

- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-plugin-react-hooks` (incl. `set-state-in-effect` rule)
- `eslint-plugin-react-refresh` (Vite HMR)

### Dependencies note

`react-beautiful-dnd` remains in `package.json` from the starter but is **unused**. Safe to remove in a cleanup pass.

---

## Assumptions & trade-offs

1. **`user_id` as duplicate key** — correct for platform-specific accounts; same human on two platforms = two list entries.
2. **Platform from URL, not profile data** — `AddToListButton` on detail page uses `?platform=` query param.
3. **Client-only persistence** — clearing browser storage clears the list; no sync across devices.
4. **No error boundary** — failed JSON imports surface as not-found; acceptable for static demo data.
5. **CSS-only animation** — no Framer Motion; smaller bundle, less gesture complexity.
6. **CDN font** — Inter via Google Fonts; requires network on first load.
7. **Search JSON fully bundled** — all 3 platforms in main chunk; acceptable at ~300 KB total JS.

---

## Commit history

```
62d6ea3 feat: redesign UI with modern responsive layout and design system
22b5b09 feat: add animations and micro-interactions across the app
116e0d6 perf: reduce re-renders and improve data loading
e8d4e07 refactor: reorganize app structure into feature-based modules
d883238 feat: implement add-to-list with duplicate prevention and list page
68bdc9a feat: add Zustand store with persisted selected list state
bea905c fix: resolve search, profile loading, and formatting bugs
6ffc83b chore: install package zustand and improve title page
5870428 first commit
```

---

## AI usage disclosure

AI-assisted development (Cursor) was used during implementation. Architecture, trade-offs, and final output were reviewed. Build verified with `npm run build` and `npm run lint`.
