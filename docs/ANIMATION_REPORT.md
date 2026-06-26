# Animation Optimization Report

## Removed (Performance-Heavy)

| Animation | Location | Replacement |
|-----------|----------|-------------|
| Three.js WebGL scene | Homepage, About | CSS gradient mesh |
| Canvas particle field | Homepage | Subtle dot grid background |
| GSAP ScrollTrigger reveals | Homepage | Intersection Observer + `.reveal` CSS |
| GSAP 3D card tilt (mousemove) | Homepage services | CSS `card-interactive` hover |
| GSAP floating hero elements | Homepage | Static metric cards |
| Infinite float on testimonials | globals.css | Removed |
| Lenis smooth scroll | SmoothScroll (unused) | Native `scroll-behavior: smooth` |
| GSAP loading timeline | LoadingScreen | CSS progress bar |

## Retained (Premium & Lightweight)

| Animation | Implementation |
|-----------|----------------|
| Scroll progress bar | CSS `scaleX` on scroll |
| Page/card hover | `transform` + `box-shadow` transitions |
| Modal open/close | `.animate-scale-in`, `.animate-fade-in` |
| Theme toggle | Icon rotate/opacity CSS |
| Stat count-up | `requestAnimationFrame` (runs once) |
| Button press | `active:scale-[0.98]` + ripple pseudo-element |
| Scroll reveal | Opacity + translateY with stagger delays |

## Guidelines Applied

- All animations use `cubic-bezier(0.16, 1, 0.3, 1)` easing
- `prefers-reduced-motion: reduce` disables all motion
- No infinite animations on primary content (except subtle pulse on live indicators)
- GPU-friendly properties only: `transform`, `opacity`

## BotChat Exception

BotChat retains minimal GSAP for chat open/close — isolated widget, low page impact. Candidate for CSS migration in a follow-up.
