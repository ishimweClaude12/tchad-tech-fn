---
applyTo: "src/**/*.tsx,src/**/*.ts"
---

# React Architecture Standards

## Tech Stack Versions

- React **19**, TypeScript **~5.9**, Vite **5**
- MUI **v7**, Tailwind **v4**, TanStack Query **v5**
- React Router DOM **v7**, react-hook-form **v7**
- Clerk for auth, react-hot-toast for notifications, Tiptap for rich text

## Component Rules

- **Functional components only** — no class components.
- **Avoid `React.FC`** — define props inline using an `interface`:
  ```tsx
  interface Props { course: Course; }
  export default function CourseCard({ course }: Props) { ... }
  ```
- **One component per file.** Export as `default`.
- **Thin components** — move complex logic (data fetching, transformations, side-effects) into custom hooks.
- Components must be **idempotent** and follow the Rules of Hooks (no conditional hook calls).

## Directory Conventions

```
src/
  components/
    learn/          # Feature-specific UI fragments (CourseCard, QuizCard, etc.)
    shared/         # Cross-feature reusable UI (EmptyState, etc.)
  pages/
    learn/          # Route-level page components
    home/           # Marketing / public pages
    shop/           # Shop section pages
    shared/         # NotFound and other shared pages
  layouts/          # Layout shells wrapping <Outlet />
  hooks/
    learn/          # TanStack Query hooks (use*.ts)
    useApi.ts       # queryKeys + misc shared hooks
  services/
    learn/          # Pure axios service functions
    api.ts          # Shared service functions (categories, users, etc.)
  contexts/         # React Context (LanguageContext)
  types/            # TypeScript interfaces and enums
  utils/
    constants/      # Translation strings, static config
    enums/          # Shared enums (Quiz.enums.ts)
    helpers/        # Pure utility functions
  lib/
    axios.ts        # Default axios instance with Clerk token interceptor
    axiosAuth.ts    # Hook-based authenticated axios
  theme.ts          # MUI theme (colors, typography, component overrides)
```

## Naming Conventions

| Artifact        | Convention                    | Example               |
| --------------- | ----------------------------- | --------------------- |
| Component files | PascalCase                    | `CourseCard.tsx`      |
| Hook files      | camelCase, `use` prefix       | `useCourseApi.ts`     |
| Service files   | PascalCase + `.api.ts` suffix | `Course.api.ts`       |
| Type files      | PascalCase + `.types.ts`      | `Course.types.ts`     |
| Enum files      | PascalCase + `.enums.ts`      | `Quiz.enums.ts`       |
| Context files   | PascalCase + `Context.tsx`    | `LanguageContext.tsx` |

## TypeScript Rules

- Use `interface` for object shapes (Props, API responses, domain models).
- Use `type` only for unions and mapped types.
- `UserRole` is a `const` object + type (not an `enum`) in `Users.types.ts` — use it as such.
- Use `import type` for type-only imports to keep bundles clean.

## Forms

- Use **react-hook-form** for all forms. Do not manage form state with `useState`.
- Validate with inline `register` rules or a schema (zod if added later).

## Routing

- Route definitions live in `src/routes.tsx`.
- Layouts use `<Outlet />` — never render children directly inside a layout.
- Protected routes should check `ELearningUser.role` after the Clerk `isSignedIn` check.
