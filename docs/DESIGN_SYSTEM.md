# Design System — Tari Technologies

## Overview

Enterprise-grade design tokens inspired by Linear, Stripe, and Vercel. Supports light/dark/auto themes via `next-themes` (`data-theme` attribute).

## Color Palette

### Primary — Deep Tech Blue / Electric Indigo
| Token | Light | Dark |
|-------|-------|------|
| `--brand-500` | `#6366f1` | `#818cf8` |
| `--brand-600` | `#4f46e5` | `#a5b4fc` |

### Secondary — Cyan
| Token | Value |
|-------|-------|
| `--secondary-500` | `#06b6d4` |

### Accent
| Token | Value |
|-------|-------|
| `--accent-emerald` | `#10b981` |
| `--accent-orange` | `#f97316` |

### Neutrals
| Token | Light | Dark |
|-------|-------|------|
| `--background` | `#fafafa` | `#0a0a0f` |
| `--foreground` | `#0f172a` | `#f8fafc` |
| `--muted-foreground` | `#64748b` | `#94a3b8` |

## Typography

- **Primary font:** Geist (via `next/font/google`)
- **Fallback:** Inter, system-ui
- **Scale:** `.text-display-xl`, `.text-display-lg`, `.text-display-md`, `.text-body-lg`, `.text-caption`

## Spacing

- Section padding: `--spacing-section` (clamp 4rem–8rem)
- Component radius: `--radius-sm` through `--radius-3xl`

## Surfaces

| Class | Usage |
|-------|-------|
| `.glass-panel` | Frosted glass cards, nav, modals |
| `.surface-elevated` | Elevated cards with shadow |
| `.card-interactive` | Hover lift + glow border |

## Component Library

Located in `components/ui/`:

- `Button` — primary, secondary, ghost, outline, danger
- `Card` — glass, elevated, interactive variants
- `Input` — labeled inputs with error states
- `Badge` — status and category labels
- `Skeleton` — loading placeholders
- `Modal` — accessible dialog with escape close
- `Alert` — info, success, warning, error
- `EmptyState` — zero-data UX

## Accessibility

- WCAG AA contrast on primary text/background pairs
- Focus rings via `.focus-ring`
- `prefers-reduced-motion` disables animations
- Semantic roles on modals and alerts
- Keyboard navigation in command palette (⌘/Ctrl+K)

## Theme Switching

```tsx
<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem />
```

Toggle via `ThemeToggle` component.
