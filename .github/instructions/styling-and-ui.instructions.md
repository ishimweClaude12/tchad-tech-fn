---
applyTo: "**/*.tsx,**/*.ts"
---

# Styling: Tailwind CSS v4 & Material UI v7

The project uses **Tailwind CSS v4** for layout/spacing and **MUI v7** for complex UI components. Both are configured to share the same brand color system.

## Brand Colors

These are the canonical brand tokens — use them consistently across Tailwind classes, `sx` props, and CSS variables:

| Token        | Hex       | Usage                                  |
| ------------ | --------- | -------------------------------------- |
| `chad-blue`  | `#1e40af` | Primary actions, links, active states  |
| `chad-gold`  | `#f59e0b` | Secondary actions, highlights, badges  |
| `chad-green` | `#059669` | Success states, certificates, progress |
| `purple`     | `#3a0293` | Accent, premium features               |
| `dark-gray`  | `#1b1b2d` | Dark backgrounds, sidebars             |

> Note: `--chad-blue` in CSS variables is `#2e68dd` (slightly lighter); the MUI/Tailwind token `chad.blue` is `#1e40af`. Use the CSS variable version for raw CSS only.

## MUI Theme (src/theme.ts)

The MUI theme is configured at `src/theme.ts` and applied via `ThemeProvider` in `src/main.tsx`.

```ts
// palette
primary.main = "#1e40af"; // chad-blue
secondary.main = "#f59e0b"; // chad-gold
success.main = "#059669"; // chad-green

// typography
fontFamily = "system-ui, Avenir, Helvetica, Arial, sans-serif";
button.textTransform = "none"; // never uppercase

// MuiButton overrides
borderRadius = 8;
padding = "0.6em 1.2em";
```

**Rules for MUI usage:**

- Use `sx` prop **only** for theme-dependent values (palette references, shadows). Use `className` for everything else.
- Never hardcode brand hex values in `sx`. Reference theme tokens: `sx={{ color: 'primary.main' }}`.
- Do not wrap content in `Box` or `Container` for layout purposes — use Tailwind instead.
- `textTransform: 'none'` is already set globally on `MuiButton`; do not override it.

## Tailwind Usage

- Tailwind v4 is configured with the brand color palette under the `chad` key:
  - `bg-chad-blue`, `text-chad-gold`, `border-chad-green`
- **Layout & spacing:** Always use Tailwind classes (`flex`, `grid`, `gap-4`, `p-4`, `m-2`).
- **Responsive:** Use Tailwind's mobile-first prefixes (`md:`, `lg:`) over MUI's `useMediaQuery` unless the breakpoint drives JS logic.
- **Tailwind + MUI:** Apply Tailwind via the `className` prop on any MUI component.

```tsx
// Correct
<Button className="w-full mt-4" sx={{ color: 'secondary.main' }}>
  Enroll Now
</Button>

// Wrong — never do this
<Box sx={{ display: 'flex', padding: '16px' }}>
```

## Icons

- Use **`@mui/icons-material`** for icons inside MUI components (buttons, form adornments, chips).
- Use **`lucide-react`** for icons in layout/sidebar/navigation contexts (see `LearnDashboardLayout`, `Navigation`).
- Do not mix icon libraries in the same component.

## Notifications / Toasts

- Use **`react-hot-toast`** (`toast.success()`, `toast.error()`) for transient feedback — not MUI `Snackbar`.
- Use MUI `Alert` only for inline, persistent error/warning messages bound to form or query state.
