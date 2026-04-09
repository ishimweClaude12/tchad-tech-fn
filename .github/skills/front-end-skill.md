---
name: Chad Tech Hub — Frontend
version: "2.0"
description: >
  Expert-level skill for the Chad Tech Hub frontend. Covers React 19 component
  patterns, TanStack Query v5 data fetching, MUI v7 + Tailwind v4 styling with
  the project's brand color system, Clerk authentication, multilingual (en/fr/ar)
  support, and the e-learning domain model (Course / Module / Lesson / Quiz).
applyTo: "src/**/*.tsx,src/**/*.ts"
categories:
  - Frontend Development
  - React
  - E-Learning
  - UI/UX Design
tags:
  - React 19
  - TypeScript
  - Tailwind CSS v4
  - Material UI v7
  - TanStack Query v5
  - Clerk Auth
  - Axios
  - React Router v7
  - react-hook-form
  - react-hot-toast
  - Tiptap
  - lucide-react
  - Multilingual / RTL
---

# Chad Tech Hub — Frontend Skill

## Stack at a Glance

| Layer            | Technology                   |
| ---------------- | ---------------------------- |
| Framework        | React 19 + TypeScript ~5.9   |
| Build            | Vite 5                       |
| UI Components    | MUI v7 (`@mui/material`)     |
| Layout / Spacing | Tailwind CSS v4              |
| Server State     | TanStack Query v5            |
| Auth             | Clerk (`@clerk/clerk-react`) |
| HTTP             | Axios (`src/lib/axios.ts`)   |
| Routing          | React Router DOM v7          |
| Forms            | react-hook-form v7           |
| Toasts           | react-hot-toast              |
| Rich Text        | Tiptap v3                    |
| Icons — layouts  | lucide-react                 |
| Icons — MUI      | `@mui/icons-material`        |

---

## Brand Color System

The color system is declared in three places and must stay in sync:

| Location             | Usage                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------- |
| `src/theme.ts`       | MUI palette tokens (`primary.main`, `secondary.main`, `success.main`)                   |
| `tailwind.config.js` | Tailwind classes (`bg-chad-blue`, `text-chad-gold`, `border-chad-green`)                |
| `src/index.css`      | CSS variables (`--chad-blue`, `--chad-gold`, `--chad-green`, `--purple`, `--dark-gray`) |

**Token table:**

| Name       | Hex       | Tailwind     | MUI              |
| ---------- | --------- | ------------ | ---------------- |
| Chad Blue  | `#1e40af` | `chad-blue`  | `primary.main`   |
| Chad Gold  | `#f59e0b` | `chad-gold`  | `secondary.main` |
| Chad Green | `#059669` | `chad-green` | `success.main`   |
| Purple     | `#3a0293` | —            | —                |
| Dark Gray  | `#1b1b2d` | —            | —                |

> Never hardcode hex values in components. Always reference a token.

---

## MUI Theme (`src/theme.ts`)

- **Typography:** `system-ui, Avenir, Helvetica, Arial, sans-serif`; `button.textTransform: "none"` globally.
- **MuiButton overrides:** `borderRadius: 8`, `padding: "0.6em 1.2em"`.
- **ThemeProvider** wraps the entire app in `src/main.tsx`.

Use `sx` **only** for palette and shadow values. Use `className` for layout:

```tsx
<Button className="w-full mt-4" sx={{ bgcolor: "primary.main" }}>
  Enroll
</Button>
```

---

## Component Pattern

```tsx
// src/components/learn/MyComponent.tsx
interface Props {
  course: Course;
}

export default function MyComponent({ course }: Props) {
  const { data, isLoading } = useCourseById(course.id); // custom hook
  if (isLoading) return <CircularProgress />;
  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h5">{data?.title}</Typography>
    </div>
  );
}
```

- No `React.FC`. Props via `interface`. One file, `export default`.
- All data fetching goes in `src/hooks/learn/use*.ts`, never directly in a component.

---

## Data Fetching Pattern

```
src/services/learn/Course.api.ts   ← pure axios functions
src/hooks/learn/useCourseApi.ts    ← useQuery / useMutation wrappers
src/hooks/useApi.ts                ← queryKeys factory
```

Mutation template:

```ts
return useMutation({
  mutationFn: coursesApi.update,
  onSuccess: (_, { id }) => {
    toast.success("Saved");
    queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(id) });
  },
  onError: () => toast.error("Failed to save"),
});
```

---

## Auth Pattern

```ts
const { user } = useUser(); // Clerk user (id = clerkId)
const { data: ELearningUser } = useELearningUser(user?.id ?? ""); // platform user with role
const isAdmin = ELearningUser?.role === UserRole.ADMIN || UserRole.SUPPER_ADMIN;
```

Token is injected automatically by `src/lib/axios.ts` — no manual token passing.

---

## Multilingual Pattern

```ts
import { useLanguage } from "src/contexts/LanguageContext";
const { language, isRTL } = useLanguage();
// Apply RTL: <div dir={isRTL ? "rtl" : "ltr"}>
```

Translation keys only \u2014 never hardcode English strings in JSX.

---

## E-Learning Domain

- **Course** → **Module** → **Lesson** (Video | Quiz | Text)
- `CourseStatus.DRAFT` → `CourseStatus.PUBLISHED`
- `UserRole`: `STUDENT | INSTRUCTOR | ADMIN | SUPPER_ADMIN` (note the casing — matches API)
- Video: Mux-hosted, reference by `muxPlaybackId`
- Rich text: Tiptap \u2014 always sanitize before rendering
