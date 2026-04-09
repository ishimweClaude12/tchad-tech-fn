---
applyTo: "src/pages/learn/**,src/components/learn/**,src/hooks/learn/**,src/services/learn/**"
---

# E-Learning Domain

Chad Tech Hub is a multilingual SaaS e-learning platform for course delivery, student tracking, and instructor management.

## Domain Model

| Entity       | Description                                     | Key Fields                                                             |
| ------------ | ----------------------------------------------- | ---------------------------------------------------------------------- |
| `Course`     | Main learning unit                              | `id`, `slug`, `title`, `status`, `price`, `categoryId`, `instructorId` |
| `Module`     | Ordered section within a Course                 | `courseId`, `order`, `title`                                           |
| `Lesson`     | Single content item in a Module                 | Type: `Video`, `Quiz`, or `Text`                                       |
| `Quiz`       | Set of questions attached to a Lesson or Module | `questions`, `passingScore`                                            |
| `Enrollment` | Student–Course relationship                     | `userId`, `courseId`, `progress`                                       |
| `MuxVideo`   | Mux-hosted video asset linked to a Lesson       | `muxPlaybackId`                                                        |

## User Roles

Defined in `src/types/Users.types.ts` as a `const` object (not enum):

```ts
UserRole.STUDENT; // default learner
UserRole.INSTRUCTOR; // course creator
UserRole.ADMIN; // platform manager
UserRole.SUPPER_ADMIN; // full access (note: typo is intentional — matches the API)
```

Always compare roles against the `UserRole` const object, never raw strings.

## Authentication — Clerk

The app uses **Clerk** (`@clerk/clerk-react`) for identity.

- `useUser()` → `user.id` is the Clerk user ID used throughout the app.
- The backend user object is fetched separately via `useELearningUser(user.id)` and exposes the platform `role`.
- Auth tokens are injected automatically by the Axios interceptor in `src/lib/axios.ts`.

## Course Status Flow

```
DRAFT → PUBLISHED
```

Toggle via `coursesApi.publish(id, true/false)`. Published courses are publicly visible on `/learn`.

## Route Structure

| Segment               | Layout                 | Audience                   |
| --------------------- | ---------------------- | -------------------------- |
| `/learn`              | `MainLayout`           | Public — course catalog    |
| `/learn/course/:slug` | `MainLayout`           | Public — landing page      |
| `/learn/dashboard/*`  | `LearnDashboardLayout` | Admin/Instructor/Student   |
| `/learn/:id/checkout` | `MainLayout`           | Authenticated students     |
| `CourseLayout`        | Nested under dashboard | Active learner course view |

## Multilingual Support

- Supported languages: **English** (`en`), **French** (`fr`), **Arabic** (`ar`).
- Arabic triggers RTL layout (`isRTL = language === 'ar'`) via `LanguageContext`.
- Translation strings live in `src/utils/constants/` (e.g., `navigation.translations.ts`). Always use translation keys — never hardcode UI strings.

## Accessibility

- All MUI form inputs must have associated labels (`label` prop or `InputLabel`).
- All `<img>` and `CardMedia` elements must have descriptive `alt` text.
- Maintain proper heading hierarchy: `h1` (page title) → `h2` (sections) → `h3` (sub-sections).
- The sidebar toggle state is managed locally in each layout — not in context.

## Video

- Video assets are hosted on **Mux**. Reference by `muxPlaybackId` — do not construct raw URLs.
- Lesson video components must include: playback speed control, progress persistence (save to enrollment record).

## Rich Text

- Course `description` and lesson `content` fields may contain rich text authored via **Tiptap**.
- Always render rich text with a sanitized HTML renderer — never use `dangerouslySetInnerHTML` without sanitization.
