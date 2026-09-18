# ANASTARS PERSONAL TATTOO
# MOTION SYSTEM & GESTURE SPECIFICATION

> **DOCUMENT ID:** `07_MOTION_SYSTEM.md`  
> **READ PRIORITY:** **8TH**  
> **ANIMATION ENGINE:** React Native Reanimated 3 + React Native Gesture Handler  
> **HAPTIC ENGINE:** `expo-haptics`  
> **STATUS:** PRODUCTION-VERIFIED (NATIVE MOBILE STANDARDS)

---

## 1. Motion Philosophy

In **ANASTARS TATTOO**, motion is never decorative noise or arbitrary bouncing. It is **tactile physics**:
- It gives digital objects the weight, resistance, and precision of high-end mechanical instruments and surgical tools.
- Transitions feel like physical page turns of an expensive archival monograph.
- Every gesture receives immediate, subtle physical acknowledgment via synchronized **haptics**.
- **Anti-Bounce Rule**: Avoid cartoonish high-frequency oscillations. Springs must settle smoothly and decisively.

---

## 2. Spring Physics Presets (Reanimated 3)

All interactive motion is built using parameterized physical springs rather than linear duration timers:

```typescript
// src/animations/springs.ts
export const SPRING_PRESETS = {
  // 1. TACTILE PRESS (Buttons, Cards, Chips)
  tactilePress: {
    damping: 18,
    stiffness: 280,
    mass: 0.6,
  },

  // 2. SHEET SNAP (Bottom sheets, Modal cards)
  sheetSnap: {
    damping: 24,
    stiffness: 220,
    mass: 0.9,
  },

  // 3. IMAGE EXPANSION / LIGHTBOX (Shared elements)
  imageExpand: {
    damping: 26,
    stiffness: 190,
    mass: 1.0,
  },

  // 4. SLIDER / BEFORE-AFTER HANDLE (High resistance, no overshoot)
  sliderDrag: {
    damping: 32,
    stiffness: 350,
    mass: 0.5,
  },

  // 5. TOAST NOTIFICATION ENTER/EXIT
  toastNotification: {
    damping: 20,
    stiffness: 240,
    mass: 0.8,
  },
};
```

---

## 3. Timing & Easing Curves (For Non-Physics Transitions)

For linear UI fades and opacity transitions:
- **Fast / Micro (150ms)**: Badge state changes, checkbox ticks, icon switches.  
  `Easing.bezier(0.25, 1, 0.5, 1)` (Decelerate curve).
- **Medium / Content (280ms)**: Filter tab content fade, accordion collapse/expand.  
  `Easing.bezier(0.16, 1, 0.3, 1)` (Smooth out).
- **Cinematic / Fullscreen (400ms)**: Screen cross-fades, deep detail modal entries.  
  `Easing.bezier(0.19, 1, 0.22, 1)` (Editorial ease-out).

---

## 4. Gestural Interactions

### 4.1 "Before & After" Transformation Slider
- **Gesture**: `Gesture.Pan()` bound to the vertical center divider.
- **Physics**: As the user drags horizontally, the slider tracks the fingertip with 1:1 precision.
- **Haptic Trigger**: When the slider passes the exact 50% midpoint, an instant `Haptics.impactAsync(ImpactFeedbackStyle.Light)` fires.
- **Release Action**: When released, if dragged past 85% in either direction, it smoothly snaps to 100% or 0% using `SPRING_PRESETS.sliderDrag`.

### 4.2 Portfolio Lightbox & Pinch-to-Zoom
- **Gestures**: Simultaneous `Gesture.Pinch()` and `Gesture.Pan()`.
- **Zoom Limit**: Minimum scale `1.0x`, maximum scale `4.0x` (allowing inspection of microrealism needle groupings).
- **Release Physics**: On finger release, if scale is `< 1.0x`, it immediately springs back to `1.0x`. If zoomed, double-tapping smoothly resets to `1.0x`.
- **Swipe-to-Dismiss**: Swiping downward with high vertical velocity (`velocityY > 1200`) or translation (`translationY > 150`) triggers a smooth dismiss fade back to the catalog feed.

### 4.3 Native Bottom Sheet Snapping
- **Sheet Heights**: 3 snap points: `Collapsed (0%)`, `Midway (50%)`, `Full (92%)`.
- **Snapping Logic**: Uses velocity-aware projection. A fast upward flick immediately locks to 92%; a downward flick dismisses the sheet with `Haptics.impactAsync(ImpactFeedbackStyle.Light)`.

---

## 5. Haptic Feedback Choreography

Haptics must be mapped strictly to physical state changes using `expo-haptics`:

| User Action | Haptic Token | Experience Goal |
| :--- | :--- | :--- |
| Primary Button Press | `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` | Firm mechanical click |
| Style Filter Pill Selected | `Haptics.impactAsync(ImpactFeedbackStyle.Light)` | Delicate snap |
| Calendar Date Tapped | `Haptics.selectionAsync()` | Subtle tick |
| Before/After Midpoint Pass| `Haptics.impactAsync(ImpactFeedbackStyle.Light)` | Tactile notch |
| Image Pinch Boundary Hit | `Haptics.impactAsync(ImpactFeedbackStyle.Light)` | Elastic wall stop |
| Healing Step Checked Off | `Haptics.notificationAsync(NotificationFeedbackType.Success)` | Satisfying accomplishment |
| Form Validation Error | `Haptics.notificationAsync(NotificationFeedbackType.Error)` | Warning pulse |

---

## 6. Skeletons & Content Loading States

- **No Jarring Layout Shifts**: Skeleton containers must exactly match the height, width, and aspect ratio of the incoming artwork or text block.
- **Gothic Shimmer Effect**:
  - Base skeleton surface: `#141416`
  - Shimmer wave: Linear gradient highlighting to `#1E1E22` (subtle 6% brightness delta).
  - Duration: `1400ms` infinite linear loop with smooth phase ramp.

---

## 7. Accessibility: Reduced Motion Support

For users with vestibular disorders or `prefers-reduced-motion` enabled in iOS Settings:
1. All physical spring animations (`transform: [{ scale }]`, `translateY`) are automatically bypassed.
2. In-place cross-fades (`opacity: withTiming(1, { duration: 150 })`) are substituted.
3. Implemented globally via a custom hook:
```typescript
// src/animations/useSafeAnimation.ts
import { useReducedMotion } from 'react-native-reanimated';

export function useSafeAnimation() {
  const isReduced = useReducedMotion();
  return {
    isReduced,
    springOrFade: (toValue: number, springConfig: any) => {
      'worklet';
      if (isReduced) {
        return withTiming(toValue, { duration: 150 });
      }
      return withSpring(toValue, springConfig);
    }
  };
}
```
