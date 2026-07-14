# Kiosk-Specific Design Decisions

## Display & Hardware

### Target Hardware
- **Resolution**: 1080×1920px (portrait orientation)
- **Device Type**: Touch-enabled kiosk displays
- **Interaction**: Touch-only (no keyboard navigation)
- **Aspect Ratio**: 9:16 (portrait)

### Why Portrait?
The kiosk is mounted vertically for maximum visibility and ideal interaction height. All UI components are optimized for vertical scrolling and touch gestures.

### Why No Scroll?
All components are designed to fit within the viewport without scrolling:
- Fixed viewport with `overflow: hidden`
- Full-screen modal dialogs
- Single-screen experiences per interaction
- Prevents confusion and improves UX

---

## Screen Flow

### Primary Flow
```
ATTRACT → REGISTER → PROCESSING → SPINNING → WINNER → ATTRACT
```

### Hourly Draw Flow (Admin-triggered)
```
ATTRACT → LOADING_SESSION → REGISTER → SPINNING → WINNER → REGISTER (loop)
```

- **ATTRACT**: Idle screen with animated particles and CTA
- **REGISTER**: Lead capture form (name, phone, receipt, ID)
- **PROCESSING**: Server-side validation simulation (4 seconds)
- **SPINNING**: Prize wheel animation with predictable outcome
- **WINNER**: Celebration screen with confetti and validation

---

## Session Management

### Hourly Inventory System
Each hour (7pm–10pm) has a dedicated prize pool:
- **7pm**: Gold bar, earbuds, reward points, giveaway items
- **8pm**: Gold pound, smartwatch, reward points, giveaway items
- **9pm**: Mixed inventory with emphasis on giveaway items
- **10pm**: Similar to 7pm

Each session deck contains 8 prizes. When depleted, the session is marked as "Completed" in the admin console.

### Why Hourly Sessions?
- Staggered prize availability (realistic for event management)
- Inventory control (prevents over-awarding)
- Session tracking for analytics
- Admin visibility into event progress

---

## Idle Timeout

### Behavior
- **Timeout Duration**: 60 seconds of user inactivity
- **Triggers**: Mouse, touch, or keyboard events
- **Action**: Automatic return to ATTRACT screen

### Why 60 Seconds?
- Leaves time for slow interactions (fill form, watch wheel)
- Prevents kiosk from being stuck on a screen if user walks away
- Standard for public kiosks

---

## Data Persistence

### localStorage Keys
- `spin_to_win_leads`: Array of captured leads (name, phone, receipt, ID, prize, timestamp)
- `spin_to_win_decks`: Session prize decks (remaining prizes per hour)

### Why localStorage?
- No backend required (offline-capable)
- Persists across sessions
- Fast access (no network latency)
- Graceful degradation if storage quota exceeded

### Error Handling
- All localStorage operations wrapped in try-catch
- Quota exceeded errors logged to console
- App continues functioning with in-memory data

---

## Admin Access

### Security Features
- **Triple-tap gesture**: Hidden trigger (top-right corner)
- **PIN authentication**: Configurable via `.env` (default: `123`)
- **Session management**: Start hourly draws, view remaining prizes
- **Data export**: CSV download with timestamp

### Admin Console Permissions
- Launch hourly draws
- View remaining prizes per session
- Export all leads to CSV
- Reset all decks (with confirmation)

### Why Triple-Tap?
- Unlikely to trigger accidentally
- Invisible to guests (no UI element)
- Quick for staff (1.5-second timeout)

---

## Audio Feedback

### Sounds
- **Tick**: 880 Hz sine wave, 50ms duration (decreases during spin)
- **Win**: Four-note C major arpeggio (C5, E5, G5, C6)

### Why Procedurally Generated?
- No asset files needed
- Small bundle size
- Graceful fallback if Web Audio API fails

### Autoplay Handling
- Silently fails if autoplay is blocked (common on mobile/kiosks)
- Users can enable audio via browser settings
- App remains fully functional without sound

---

## Visual Design

### Color Palette
- **Primary**: Red (#dc2626) – luxury, excitement
- **Accent**: Gold/white gradients – premium aesthetic
- **Background**: Off-white (#ffffff) – clean, professional
- **Text**: Dark stone (charcoal) – high contrast

### Why This Palette?
- Red conveys excitement and urgency (common in raffles)
- Gold suggests luxury and reward
- White/light backgrounds reduce eye strain on long kiosk use
- High contrast ensures accessibility

### Typography
- **Serif fonts**: Event titles, elegant headers
- **Sans-serif**: Form labels, body text (Montserrat)
- **Large text**: Minimum 14px for touch-friendly interactions

---

## Animations & Transitions

### Framer Motion Usage
- Page transitions: Blur scale fade (300ms)
- Component entry: Staggered opacity + translate
- Button feedback: Scale on active (active:scale-95)

### Why Animations?
- Provides visual feedback (users know something happened)
- Makes interactions feel responsive
- Draws attention to important elements (win screen)
- Improves perception of performance

### Performance Considerations
- Animations limited to visual feedback, not critical paths
- Canvas rendering for wheel (GPU-accelerated)
- Confetti capped at ~100 particles

---

## Touch Interactions

### Input Targets
- **Minimum touch target**: 44×44px (accessibility standard)
- **Optimal target**: 60×60px for kiosks
- **Spacing**: 16px minimum between targets (prevent mis-taps)

### Gesture Recognition
- **Tap**: Form submission, prize wheel spin, navigation
- **Triple-tap**: Admin access (top-right corner)
- **No swipe/pinch**: Not supported (kiosk use case)

---

## Kiosk Deployment Checklist

- [ ] Display set to portrait mode (1080×1920)
- [ ] Browser fullscreen enabled (kiosk mode)
- [ ] Touch driver calibrated (optional on some displays)
- [ ] Admin PIN set in `.env` (change from default)
- [ ] Test all screens on actual hardware
- [ ] Verify audio on target kiosk (some disable audio)
- [ ] Set network to offline (tests localStorage persistence)
- [ ] Monitor browser console for errors

---

## Performance Notes

### Optimization Strategies
1. **Canvas wheel rendering**: Pre-calculated arc geometry, single redraw per frame
2. **localStorage caching**: Minimal JSON serialization
3. **Component memoization**: Prevents unnecessary re-renders
4. **CSS animations**: Prefer hardware acceleration (transform, opacity)

### Known Limitations
- Requires modern browser (ES6+, Web Audio API, Crypto API)
- Large lead datasets (1000+) may slow CSV export
- Wheel animation is smooth on devices with 60+ FPS capable displays

---

## Troubleshooting

### Blank Screen After Idle
- Check `useIdleTimer` hook (should return to ATTRACT)
- Verify `IDLE_RESET` action is dispatched
- Clear browser cache and reload

### Audio Not Working
- Check browser autoplay policy (kiosk browsers may differ)
- Verify Web Audio API availability (desktop Chrome/Safari)
- Some kiosks disable audio—test on target hardware

### Storage Quota Exceeded
- Export leads to clear `localStorage`
- Implement server-side sync for long-term storage
- Monitor lead count in admin console

### Wheel Not Landing on Correct Prize
- Check `PRIZES` array length (should match wheel segments)
- Verify spin duration aligns with rotation calculation
- Test on target hardware (frame rate may affect timing)
