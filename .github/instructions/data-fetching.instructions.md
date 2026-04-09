---
applyTo: "**/*.ts,**/*.tsx"
---

# Data Fetching: TanStack Query v5 + Axios

All server state is managed with **TanStack Query v5**. HTTP calls are made through Axios instances in `src/lib/`.

## File Locations

| Layer             | Path                                               | Responsibility                        |
| ----------------- | -------------------------------------------------- | ------------------------------------- |
| Axios instance    | `src/lib/axios.ts`                                 | Unauthenticated & auto-token requests |
| Auth Axios hook   | `src/lib/axiosAuth.ts` → `useAuthenticatedAxios()` | Hook-based Clerk token injection      |
| Service functions | `src/services/learn/*.ts`                          | Pure async functions — no React       |
| Query hooks       | `src/hooks/learn/use*.ts`                          | `useQuery` / `useMutation` wrappers   |
| Query keys        | `src/hooks/useApi.ts` → `queryKeys`                | Central key factory                   |

## Rules

### Hook Pattern

Never call `useQuery` or `useMutation` directly in a component. Always wrap them in a custom hook file under `src/hooks/learn/`.

```ts
// src/hooks/learn/useCourseApi.ts
export const useCourses = (filters?: CourseFilters) =>
  useQuery({
    queryKey: queryKeys.courses.list(filters),
    queryFn: () => coursesApi.getAll(filters),
  });
```

### Query Keys

All query keys live in the `queryKeys` factory in `src/hooks/useApi.ts`. Never write raw string arrays in components or hooks. Add new keys to the existing factory following the established shape.

```ts
queryKeys.courses.list(filters);
queryKeys.courses.detail(id);
queryKeys.courses.published();
```

### Global Query Defaults (set in App.tsx)

```ts
staleTime: 5 minutes
gcTime: 10 minutes
refetchOnWindowFocus: false
retry: 3
```

Only override these when data is highly volatile or must be fresh on every render.

### Mutations

- Always call `toast.success()` / `toast.error()` from `react-hot-toast` inside `onSuccess` / `onError`.
- Always invalidate the relevant `queryKeys.*` group in `onSuccess`.
- Invalidate both the `.all` key and the specific `.detail(id)` key when updating a single resource.

```ts
onSuccess: (_, variables) => {
  toast.success("Course updated successfully");
  queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(variables.id) });
},
onError: () => {
  toast.error("Failed to update course");
},
```

### Error Handling

- Use `react-hot-toast` for transient mutation errors.
- Use MUI `Alert` for inline persistent error states (e.g., form submission failures visible on the page).
- For query errors, destructure `error` from `useQuery` and render an `Alert` with `severity="error"`.

### Authentication

- `src/lib/axios.ts` automatically reads a Clerk token from `window.Clerk.session` or localStorage fallback. Use it for all standard API calls.
- Use `useAuthenticatedAxios()` from `src/lib/axiosAuth.ts` only in components that need hook-lifecycle token refreshing (rare).
- Never store or pass tokens manually — rely on the interceptors.
