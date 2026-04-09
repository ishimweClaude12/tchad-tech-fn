# Chad Tech Hub — Copilot Instructions

You are an expert full-stack assistant working on **Chad Tech Hub**, a multilingual SaaS e-learning platform built with React 19, TypeScript, MUI v7, Tailwind CSS v4, and TanStack Query v5.

Always read and follow the project instruction files:

- `.github/instructions/react-architecture.instructions.md`
- `.github/instructions/data-fetching.instructions.md`
- `.github/instructions/e-learning-domain.instructions.md`
- `.github/instructions/styling-and-ui.instructions.md`

---

## Project Overview

| Concern          | Solution                                        |
| ---------------- | ----------------------------------------------- |
| UI components    | MUI v7 (`@mui/material`, `@mui/icons-material`) |
| Layout & spacing | Tailwind CSS v4                                 |
| Server state     | TanStack Query v5                               |
| Auth             | Clerk (`@clerk/clerk-react`)                    |
| HTTP client      | Axios (`src/lib/axios.ts`)                      |
| Routing          | React Router DOM v7                             |
| Forms            | react-hook-form v7                              |
| Toasts           | react-hot-toast                                 |
| Rich text        | Tiptap v3                                       |
| Icons (layouts)  | lucide-react                                    |
| Icons (MUI)      | `@mui/icons-material`                           |
| Build tool       | Vite 5                                          |

---

## Project Structure

```
src/
  components/
    learn/          # E-learning UI fragments (CourseCard, QuizCard …)
    shared/         # Cross-feature reusables (EmptyState)
  pages/
    learn/          # Route-level pages for the /learn section
    home/           # Public marketing pages
    shop/           # Shop section
    shared/         # NotFound and global shared pages
  layouts/          # Layout shells using <Outlet />
  hooks/
    learn/          # TanStack Query hooks (useCourseApi.ts, etc.)
    useApi.ts       # queryKeys factory + shared hooks
  services/
    learn/          # Pure axios service functions (Course.api.ts, etc.)
    api.ts          # Shared services (categories, users, modules)
  contexts/
    LanguageContext.tsx   # en / fr / ar + isRTL
  types/            # TypeScript interfaces (.types.ts) and enums
  utils/
    constants/      # Translation strings, static nav config
    enums/          # Shared enums
    helpers/        # Pure utility functions
  lib/
    axios.ts        # Global axios instance with Clerk token interceptor
    axiosAuth.ts    # Hook-based authenticated axios (useAuthenticatedAxios)
  theme.ts          # MUI theme — colors, typography, component overrides
  routes.tsx        # All route definitions
  main.tsx          # App entry: ThemeProvider, ClerkProvider, LanguageProvider
```

---

## Brand Colors

Always use the canonical brand tokens \u2014 never hardcode arbitrary hex values.

| Name       | Hex       | Tailwind class  | MUI token        |
| ---------- | --------- | --------------- | ---------------- |
| Chad Blue  | `#1e40af` | `bg-chad-blue`  | `primary.main`   |
| Chad Gold  | `#f59e0b` | `bg-chad-gold`  | `secondary.main` |
| Chad Green | `#059669` | `bg-chad-green` | `success.main`   |
| Purple     | `#3a0293` | \u2014          | \u2014           |
| Dark Gray  | `#1b1b2d` | \u2014          | \u2014           |

CSS variables (`--chad-blue`, `--chad-gold`, etc.) are defined in `src/index.css` for use in raw CSS/SCSS only.

---

## Key Conventions

### Components

- Functional components only. No `React.FC`. Props via `interface`.
- One component per file, `export default`.
- Move all data fetching and side-effects into custom hooks.

### Data Fetching

- All queries in `src/hooks/learn/use*.ts`. All services in `src/services/learn/*.ts`.
- Query keys from the `queryKeys` factory in `src/hooks/useApi.ts`.
- `onSuccess` → `toast.success` + `queryClient.invalidateQueries`.
- `onError` → `toast.error`.

### Styling

- Tailwind for layout and spacing. MUI `sx` only for palette/shadow values.
- Use `className` prop on MUI components for Tailwind utilities.
- Do not wrap layout in `<Box>` or `<Container>` when Tailwind suffices.

### Auth & Roles

- `useUser()` from Clerk \u2192 `user.id` is the Clerk ID.
- `useELearningUser(user.id)` fetches the platform user (with `role`).
- Role constants: `UserRole.STUDENT | INSTRUCTOR | ADMIN | SUPPER_ADMIN`.

### Multilingual

- Supported: `en`, `fr`, `ar` (Arabic = RTL).
- All UI strings must use translation keys from `src/utils/constants/`. No hardcoded English strings in components.
