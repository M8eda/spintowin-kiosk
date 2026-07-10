# 🏛️ Parkville Luxury Kiosk

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.3-06B6D4?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4-0055FF?logo=framer)
![License](https://img.shields.io/badge/license-Private-red)

**A premium interactive kiosk experience for luxury beauty brand activations.**  
Spin-to-win gamification with real-time lead capture, CSV export, and elegant motion design.

---

## 📸 Overview

Parkville Kiosk is a touch-first progressive web application designed for portrait-mode kiosk displays (1080×1920). It combines a sophisticated golden wheel-of-fortune mechanic with a sleek registration flow, confetti celebrations, and immersive audio feedback—all wrapped in a dark, jewel‑toned luxury aesthetic.

---

## 🧩 Architecture
spintowin-kiosk/
├── public/
├── src/
│ ├── components/
│ │ ├── AttractScreen.jsx # Idle loop with particles & CTA
│ │ ├── RegisterScreen.jsx # Lead capture form (validated)
│ │ ├── SpinScreen.jsx # Prize wheel with tick sounds
│ │ └── WinnerScreen.jsx # Confetti + prize validation
│ ├── context/
│ │ └── GameContext.jsx # State machine (useReducer + localStorage)
│ ├── hooks/
│ │ └── useSound.js # Web Audio API sound effects
│ ├── App.jsx # Screen router + secret admin export
│ ├── main.jsx # ReactDOM entry
│ └── index.css # Tailwind + global resets
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js

text

### 🔄 State Machine
ATTRACT → REGISTER → SPINNING → WINNER → ATTRACT (loop)

text

All state is managed by a `useReducer` inside `GameContext`, persisted to `localStorage` for crash recovery. An idle timeout (60s) automatically returns the kiosk to the attract screen.

---

## ✨ Features

- **Luxury Motion Design** – Framer Motion page transitions (blur + scale), floating golden particles, and rotating gem logo.
- **Golden Prize Wheel** – SVG-based wheel with 8 jewel‑toned segments, accurate arc geometry, decelerating tick sounds via Web Audio API, and a satisfying win jingle.
- **Smart Lead Capture** – Validated registration form (name, mobile, email) with touch‑friendly inputs and animated error states.
- **Celebration Screen** – Canvas‑confetti cannons, gold flash overlay, and animated prize reveal.
- **Secret CSV Export** – Triple‑tap the top‑right corner to download a timestamped CSV of all captured leads. Perfect for on‑site staff.
- **Kiosk Optimized** – Fixed viewport, no scroll, large touch targets, and mobile‑first responsive scaling (works on any portrait device).
- **Audio Feedback** – Procedurally generated tick sounds that slow down with the wheel, plus a triumphant four‑note win melody.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd spintowin-kiosk

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
🎯 Usage Flow
Attract Screen – A rotating gem, animated brand name, and pulsing "Touch to Begin" button draw users in.

Registration – Users enter their name, mobile, and email. Client‑side validation prevents empty or malformed entries.

Prize Wheel – A tap anywhere on the screen spins the wheel. The wheel lands exactly on the preselected prize (guaranteed visual match).

Winner Reveal – Confetti bursts, a golden flash, and the prize name appear. Tapping "Validate Prize" saves the lead and resets for the next user.

🛡️ Secret Admin Export
Triple‑tap the top‑right corner of the kiosk screen at any time. A subtle button appears showing the lead count. Tap it to download a CSV file with all collected entries:

text
Name,Mobile,Email,Prize,Timestamp
"Jane Doe","+1234567890","jane@example.com","Gold Set","2026-07-10T14:30:00.000Z"
🎨 Tech Stack
LayerTechnology
FrameworkReact 19 (with Hooks)
Build ToolVite 8
StylingTailwind CSS 4 (utility‑first)
AnimationFramer Motion 12
AudioWeb Audio API (custom hook)
Confetticanvas‑confetti
IconsLucide React
State ManagementReact Context + useReducer
PersistencelocalStorage
DeploymentStatic hosting (Vercel, Netlify, etc.)
📱 Responsive Design
The UI uses viewport‑relative units (vw, vh, dvh) and Tailwind breakpoints to adapt seamlessly from iPhone SE (375px) to large kiosk displays. The wheel size is constrained to min(400px, 90vw), ensuring it never overflows the screen.

🔧 Performance Optimizations
React.memo on static wheel segments to prevent unnecessary re‑renders.

useMemo / useCallback for derived data and event handlers.

CSS transition with will-change: transform for hardware‑accelerated wheel spin.

Timeout cleanup on unmount to prevent memory leaks.

Confetti animation properly stopped via cancelAnimationFrame.

🤝 Contributing
This is a private client project. For major changes, open an issue first to discuss what you would like to change.

📄 License
Private – All rights reserved. Created for Parkville Luxury Beauty.
