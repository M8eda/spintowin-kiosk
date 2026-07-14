# Performance Optimization Guide

## Kiosk Performance Considerations

This guide outlines performance optimization strategies and monitoring for the Parkville Luxury Kiosk.

---

## Current Optimizations

### 1. Canvas Rendering (Wheel)
- **Pre-calculated geometry**: Arc calculations done in `SpinScreen.jsx`
- **Single re-render per frame**: Uses `requestAnimationFrame` instead of React renders
- **GPU acceleration**: Transform/opacity animations use GPU
- **Rim gradient**: Pre-calculated radial gradient (not per-frame)

### 2. localStorage Caching
- **Minimal serialization**: Only serialized at critical points (SET_PRIZE, SAVE_AND_RESET, START_SESSION)
- **Lazy loading**: Data loaded only on app init
- **Error handling**: Quota exceeded handled gracefully

### 3. Component Optimization
- **Memoization**: `FallingProducts` uses `useMemo` for particle generation
- **AnimatePresence mode="wait"**: Prevents simultaneous animations
- **CSS over JS animations**: Framer Motion uses GPU-accelerated transforms

### 4. Audio
- **Web Audio API**: No asset files (procedural generation)
- **Graceful degradation**: Silent fallback if blocked
- **On-demand**: Only plays when triggered

---

## Monitoring Performance

### Browser DevTools Checks

1. **Frame Rate**
   - Open Chrome DevTools → Performance tab
   - Record 5-second session (Attract → Spin → Winner)
   - Target: 60 FPS (no red frames)
   - Accept: 50-60 FPS on kiosk hardware

2. **Memory Usage**
   - Monitor localStorage consumption
   - Track heap size (should stay <50MB)
   - Watch for memory leaks during extended use

3. **Network (if future APIs added)**
   - Keep requests minimal
   - Cache responses aggressively
   - Implement timeout handling

### Local Profiling

```javascript
// Add to any component for performance testing:
console.time('component-render');
// ... component code
console.timeEnd('component-render');

// Monitor FPS:
let fps = 0;
let lastTime = performance.now();
const fpsMonitor = () => {
  fps++;
  const time = performance.now();
  if (time > lastTime + 1000) {
    console.log(`FPS: ${fps}`);
    fps = 0;
    lastTime = time;
  }
  requestAnimationFrame(fpsMonitor);
};
requestAnimationFrame(fpsMonitor);
```

---

## Bottlenecks & Solutions

### Known Issues

| Issue | Current Impact | Mitigation |
|-------|----------------|-----------|
| Canvas wheel redraws | ~5-10ms per frame | Pre-render wheel segments as static image |
| Confetti particles | ~15ms with 100 particles | Cap particles to 50 on low-end devices |
| FallingProducts animation | ~3-5ms per frame | Reduce particle count to 10-15 |
| Form re-renders | Minimal | Already optimized |
| localStorage parsing | <1ms (JSON small) | Keep lead dataset under 1000 records |

### Future Optimizations

1. **Wheel Pre-rendering**
   - Use `canvas.toDataURL()` to cache rendered wheel
   - Update only on session change
   - Saves 5-10ms per frame

2. **Particle System**
   - Implement object pooling for confetti
   - Reuse particle instances instead of creating new
   - Saves garbage collection overhead

3. **React 18 Concurrency**
   - Use `useTransition` for non-critical updates
   - Prioritize wheel spin animation
   - Keep form responsive

4. **Service Worker**
   - Cache assets for faster load
   - Enable offline mode fully
   - Reduce network latency

---

## Testing on Hardware

### Before Deployment

1. **Frame Rate Test**
   - Run 10 consecutive spins
   - Monitor DevTools Performance tab
   - Accept only if sustains 50+ FPS

2. **Storage Test**
   - Generate 500+ leads
   - Export CSV
   - Verify no lag or crashes

3. **Audio Test**
   - Enable/disable audio in browser settings
   - Verify wheel tick sounds work
   - Test win melody

4. **Thermal Test**
   - Run for 2+ hours continuously
   - Monitor CPU/GPU temperature
   - Check for thermal throttling (performance drops)

### Hardware Targets

| Metric | Target | Acceptable |
|--------|--------|-----------|
| FPS (spinning) | 60 | 50+ |
| FPS (idle attract) | 30-45 | 30+ |
| Memory | <50MB | <100MB |
| Load time | <2s | <5s |
| CSS paint | <16ms | <20ms |

---

## Troubleshooting Performance Issues

### Wheel Animation Stutters

**Check:**
- Browser DevTools → Performance tab
- Recording shows dropped frames?
- GPU acceleration enabled?

**Solutions:**
```css
/* Ensure GPU acceleration */
.wheel-container {
  will-change: transform;
  transform: translateZ(0);
}
```

### Memory Leaks

**Check:**
- Chrome DevTools → Memory tab
- Heap size grows over time?
- Event listeners accumulating?

**Solutions:**
- Verify cleanup in `useEffect` return
- Remove event listeners in cleanup
- Check for circular references in state

### Slow CSV Export

**Check:**
- Lead count > 1000?
- JSON.stringify taking >500ms?

**Solutions:**
- Implement worker thread for CSV generation
- Stream CSV instead of generating in one go
- Split export into chunks

---

## Production Checklist

- [ ] Test on actual kiosk hardware (1080×1920)
- [ ] Verify 50+ FPS during spin animation
- [ ] Monitor memory usage for 2+ hours
- [ ] Test audio on target display
- [ ] Verify no console errors during full flow
- [ ] Test with 500+ leads in storage
- [ ] Confirm no thermal throttling
- [ ] Test admin console responsiveness

---

## Performance Metrics Reference

| Operation | Current Time | Target |
|-----------|---------|--------|
| App init | ~200ms | <500ms |
| Form validation | ~5ms | <10ms |
| Wheel spin | 5000ms | 5000ms (fixed) |
| CSV export (500 leads) | ~100ms | <500ms |
| localStorage write | <5ms | <10ms |
| Prize wheel render/frame | ~10ms | <16ms |

---

## Future Enhancements

1. **Real User Monitoring**: Add analytics to track performance in the wild
2. **A/B Testing**: Test particle count, animation duration on similar hardware
3. **Compression**: Gzip assets for faster loading
4. **Lazy Loading**: Load components only when needed
5. **Web Workers**: Offload CSV generation to worker thread
