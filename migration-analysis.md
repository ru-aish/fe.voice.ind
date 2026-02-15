# Phase 1: Source Project Migration Analysis

**Source:** `/home/rudra/Code/voice AI/nextjs-voice-agent/`
**Destination:** `/home/rudra/Code/gemini_apis/live_voice/frontend/`
**Generated:** 2026-02-15

---

## 1. Source Folder Structure

```
/home/rudra/Code/voice AI/nextjs-voice-agent/
├── src/
│   └── app/
│       ├── page.tsx                    # Main landing page (PT Clinic themed)
│       ├── layout.tsx                  # Root layout with Tracker component
│       ├── globals.css                 # Global styles (imports deepgram-styles, voice-orb)
│       ├── styles.module.css           # Landing page styles (~48KB, 2000+ lines)
│       ├── logo.png                    # Logo image for landing page
│       │
│       ├── api/                        # 23 API route files
│       │   ├── calendar/
│       │   │   ├── availability/route.ts
│       │   │   └── book/route.ts
│       │   ├── campaign/
│       │   │   ├── scheduled/route.ts
│       │   │   ├── send/route.ts
│       │   │   ├── status/route.ts
│       │   │   └── validate/route.ts
│       │   ├── campaigns/[id]/route.ts
│       │   ├── campaigns/route.ts
│       │   ├── contacts/[id]/route.ts
│       │   ├── leads/route.ts
│       │   ├── log/route.ts
│       │   ├── prompts/route.ts        # EXISTS in destination
│       │   ├── sends/[id]/route.ts
│       │   ├── token/route.ts          # Deepgram token proxy
│       │   ├── tracking/               # 7 tracking endpoints
│       │   └── t/[sendId]/route.ts
│       │
│       ├── demo/                       # Demo page with AudioOrb3D
│       │   └── page.tsx
│       │
│       ├── book/                       # Booking page
│       │   └── page.tsx
│       │
│       ├── analytics/                  # Analytics dashboard
│       │   └── page.tsx
│       │
│       ├── campaign-dashboard/         # Campaign management (local only)
│       │   ├── page.tsx
│       │   ├── campaign/[id]/page.tsx
│       │   ├── contact/[id]/page.tsx
│       │   ├── logs/[sessionId]/page.tsx
│       │   └── send/[id]/page.tsx
│       │
│       ├── campaign-send/              # Campaign sending page
│       │   └── page.tsx
│       │
│       ├── d/                          # Landing page A/B test versions
│       │   ├── 1/page.tsx
│       │   ├── 2/page.tsx
│       │   ├── 3/page.tsx
│       │   ├── 5/page.tsx
│       │   └── 4/                      # (no page.tsx)
│       │
│       ├── components/
│       │   ├── AudioOrb3D/             # 3D audio visualization (8 files)
│       │   │   ├── AudioOrb3D.tsx      # React wrapper
│       │   │   ├── AudioOrbLit.ts      # Main Lit component (1327 lines)
│       │   │   ├── visual-3d.ts        # Three.js 3D visuals
│       │   │   ├── analyser.ts         # Audio analysis
│       │   │   ├── settings.ts         # Agent settings modal
│       │   │   ├── sphere-shader.ts    # WebGL shaders
│       │   │   ├── backdrop-shader.ts  # Background shaders
│       │   │   └── utils.ts
│       │   ├── Tracker.tsx             # User activity tracking (381 lines)
│       │   ├── body/Body.tsx
│       │   ├── buttonLink/ButtonLink.tsx
│       │   ├── calendar/Calendar.tsx
│       │   ├── mic/Mic.tsx
│       │   ├── nav/Nav.tsx
│       │   ├── scheduling/
│       │   │   ├── SchedulePicker.tsx
│       │   │   └── TimezoneSelector.tsx
│       │   └── voice/VoiceOrb.tsx
│       │
│       ├── lib/
│       │   ├── CalendarFunctions.ts    # Function definitions for AI agent
│       │   ├── Deepgram.ts             # Deepgram client singleton
│       │   ├── GoogleCalendar.ts       # Google Calendar integration
│       │   ├── Logger.ts               # Logging utility
│       │   ├── Models.ts               # AI model configurations
│       │   ├── storage.ts              # LocalStorage utilities
│       │   ├── db.ts                   # Database utilities
│       │   ├── campaign/
│       │   │   ├── db.ts
│       │   │   └── smtp.ts
│       │   └── tracking/
│       │       ├── db.ts
│       │       ├── device.ts
│       │       └── geo.ts
│       │
│       ├── styles/
│       │   ├── campaign.css            # Campaign dashboard styles
│       │   ├── deepgram-styles.css     # Deepgram base styles
│       │   └── voice-orb.css           # Voice orb styles
│       │
│       ├── _old/                       # Legacy/deprecated pages
│       │   ├── AB/                     # A/B test versions v1-v16
│       │   ├── PT/
│       │   ├── pt2/
│       │   ├── text-version/
│       │   └── ui-page-testing/
│       │
│       ├── simple-test/page.tsx
│       ├── test-client/page.tsx
│       ├── test-tracking/page.tsx
│       └── t/[sendId]/route.ts
│
├── prompts/                            # AI prompt templates
│   ├── generic.md                      # Generic sales prompt (main)
│   ├── claude_version.md
│   ├── customer-support.md
│   ├── default-assistant.md
│   ├── perplexity.md
│   ├── personal-trainer.md
│   ├── sales-receptionist-with-functions.md
│   └── self_prompt_1.md
│
├── public/
│   ├── favicon.png
│   ├── logo-test.html
│   ├── piz_compressed.exr              # 3D environment map (1.8MB)
│   ├── assets/
│   │   ├── dg.svg                      # Deepgram logo
│   │   └── voice1.mp4                  # Demo video (14MB)
│   └── images/
│       ├── integrations/               # Integration logos
│       │   ├── webpt_nobg.png
│       │   ├── jane_nobg.png
│       │   └── cliniko_nobg.png
│       └── testimonials/               # Testimonial photos
│           ├── michael.png
│           ├── sarah.png
│           └── james.png
│
├── tracking/                           # Database migration scripts
│   ├── init-cloud-db.ts
│   ├── migrate-*.ts                    # Various migration scripts
│   └── seed-test-data.ts
│
├── package.json
├── next.config.ts
├── tsconfig.json
└── .env.local
```

---

## 2. Main Page File Analysis

### Source: `src/app/page.tsx`

**Location:** `/home/rudra/Code/voice AI/nextjs-voice-agent/src/app/page.tsx`

**Description:** 
- PT Clinic themed landing page with hero section, problem/solution sections, features grid, testimonials, pricing, and FAQ
- Uses React hooks (useState, useEffect, useRef)
- Implements Intersection Observer for scroll animations
- Contains interactive calculator for lost revenue
- ~1000+ lines of component code

**Imports:**
```typescript
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import logoImg from './logo.png';
import { trackAction } from './components/Tracker';
```

**Key Features:**
- Hero section with CTA buttons linking to `/demo` and `/book`
- Animated waveform visualization
- Calculator with sliders for patients/day, appointment value, missed call rate
- Testimonials grid with images
- Pricing cards (Solo $399/mo, Multi-location $699/mo)
- FAQ accordion
- Integration logos (WebPT, Jane, Cliniko)

### Source: `src/app/demo/page.tsx`

**Location:** `/home/rudra/Code/voice AI/nextjs-voice-agent/src/app/demo/page.tsx`

**Description:**
- Simple wrapper for AudioOrb3D component
- Full-screen voice agent demo
- "Back to Home" link

**Code (52 lines):**
```typescript
'use client';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import type { AudioOrb3DHandle } from '../components/AudioOrb3D/AudioOrb3D';

const AudioOrb3D = dynamic(() => import('../components/AudioOrb3D/AudioOrb3D'), { ssr: false });

export default function DemoPage() {
  const audioOrbRef = useRef<AudioOrb3DHandle>(null);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', overflow: 'hidden', background: '#000000' }}>
      <a href="/" style={{ /* back button styles */ }}>← Back to Home</a>
      <AudioOrb3D ref={audioOrbRef} />
    </div>
  );
}
```

---

## 3. All `/demo` Route References

### Active Pages

| File | Lines | Link Text/Context | Tracking Code |
|------|-------|-------------------|---------------|
| `src/app/page.tsx` | 271 | "Try Live Demo" | `data-track="pt_hero_demo"` |
| `src/app/page.tsx` | 689 | "Experience It Live" | `data-track="pt_solution_demo"` |
| `src/app/page.tsx` | 936 | (CTA section) | `data-track="pt_cta_demo"` |
| `src/app/d/1/page.tsx` | 191, 378, 523 | Various CTAs | `data-track="v1_*"` |
| `src/app/d/2/page.tsx` | 191, 378, 523 | Various CTAs | `data-track="v2_*"` |
| `src/app/d/3/page.tsx` | 191, 378, 523 | Various CTAs | `data-track="v3_*"` |
| `src/app/d/5/page.tsx` | 257, 588, 756 | Various CTAs | `data-track="v5_*"` |

### Legacy Pages (`_old/`)

| File | Lines | Notes |
|------|-------|-------|
| `_old/ui-page-testing/1/page.tsx` | 313, 345, 599 | Nav link, hero, CTA |
| `_old/text-version/TextVersionContent.tsx` | 246, 609, 902 | Hero, solution, CTA |
| `_old/pt2/page.tsx` | 266, 668, 906 | No tracking codes |
| `_old/PT/page.tsx` | 264, 642, 880 | No tracking codes |

### Pattern Summary
- **Total occurrences:** 27 across 9 files
- **Standard pattern:** `<a href="/demo" className={styles.btnPrimary} data-track="...">`
- **All references use:** Standard `<a>` tag (not Next.js `<Link>`)

---

## 4. Import Dependencies & API Connections

### Core Dependencies (package.json)

```json
{
  "dependencies": {
    "@deepgram/sdk": "^4.11.3",
    "@lit/context": "^1.1.6",
    "@neondatabase/serverless": "^1.0.2",
    "googleapis": "^171.4.0",
    "lit": "^3.2.1",
    "next": "^15.1.0",
    "nodemailer": "^8.0.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.170.0"
  }
}
```

### API Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/api/token` | Deepgram API token proxy | Used by demo page |
| `/api/prompts` | AI prompt templates | Exists in destination |
| `/api/leads` | Lead capture | Marketing automation |
| `/api/calendar/availability` | Check calendar slots | Booking system |
| `/api/calendar/book` | Create calendar event | Booking system |
| `/api/tracking/event` | User activity tracking | Analytics |
| `/api/tracking/*` | Various tracking endpoints | Analytics |
| `/api/campaign/*` | Campaign management | Marketing automation |
| `/api/campaigns/*` | Campaign CRUD | Marketing automation |
| `/api/contacts/*` | Contact management | CRM |
| `/api/sends/*` | Send tracking | Marketing automation |
| `/api/log` | Logging utility | Debugging |

### AudioOrbLit.ts API Connections

**Deepgram Agent API:**
```typescript
// WebSocket connection to Deepgram
const deepgram = new DeepgramClient({ key: this.apiKey });
this.client = deepgram.agent();

// Agent configuration
settings = {
  audio: { input: { encoding: "linear16", sample_rate: 24000 }, ... },
  agent: {
    greeting: this.currentSettings.greeting,
    listen: { provider: { type: "deepgram", model: "nova-3" } },
    speak: { provider: { type: "deepgram", model: "aura-asteria-en" } },
    think: { provider: { type: "open_ai", model: "gpt-4.1" }, ... },
    functions: calendarFunctions
  }
};
```

**Internal API Calls:**
```typescript
// Lead capture
fetch('/api/leads', { method: 'POST', body: JSON.stringify({...}) });

// Calendar availability
fetch(`/api/calendar/book?date=${args.date}&timePreference=${args.timePreference}`);

// Calendar booking
fetch('/api/calendar/book', { method: 'POST', body: JSON.stringify({...}) });

// Prompt loading
fetch('/api/prompts');
```

### Function Calling Integration

**CalendarFunctions.ts** defines 3 AI-callable functions:
1. `capture_lead_info` - Capture customer contact details
2. `check_availability` - Check calendar for available slots
3. `book_demo` - Book a demo appointment

### Tracker Component

**Tracker.tsx** - Client-side activity tracking:
- Records session start/end
- Tracks button clicks via `data-track` attributes
- Monitors section views via Intersection Observer
- Batches and sends to `/api/tracking/event`

---

## 5. Change Requirements

### Files to Copy (Priority Order)

#### Critical for Demo Page
1. `src/app/components/AudioOrb3D/*` - Already partially exists, needs sync
2. `src/app/lib/CalendarFunctions.ts` - Required for function calling
3. `src/app/lib/storage.ts` - LocalStorage fallback
4. `src/app/api/token/route.ts` - Deepgram token proxy
5. `prompts/generic.md` - Main AI prompt

#### For Landing Page
1. `src/app/page.tsx` - Main landing page
2. `src/app/styles.module.css` - Landing page styles (~2000 lines)
3. `src/app/logo.png` - Logo asset
4. `src/app/components/Tracker.tsx` - Activity tracking
5. `public/images/*` - Testimonial and integration images

#### For Booking System
1. `src/app/book/page.tsx` - Booking page
2. `src/app/api/calendar/*` - Calendar API routes
3. `src/app/lib/GoogleCalendar.ts` - Google Calendar integration
4. `src/app/components/calendar/*` - Calendar components
5. `src/app/components/scheduling/*` - Scheduling components

### Dependencies to Install

```bash
npm install @deepgram/sdk @neondatabase/serverless googleapis nodemailer
npm install -D @types/nodemailer
```

### Environment Variables Required

```env
# Deepgram
DEEPGRAM_API_KEY=your_key
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_key

# Google Calendar
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REFRESH_TOKEN=your_token
GOOGLE_CALENDAR_ID=your_calendar_id

# Database (optional)
DATABASE_URL=your_db_url
```

### Code Modifications Required

1. **Import paths** - Adjust relative imports for new directory structure
2. **API routes** - Update endpoint URLs if structure changes
3. **CSS modules** - Ensure CSS loader is configured in Next.js
4. **Image optimization** - Configure next/image for new assets
5. **Three.js shaders** - Verify WebGL compatibility

### Files NOT to Migrate

- `src/app/_old/*` - Legacy/deprecated pages
- `src/app/campaign-dashboard/*` - Local-only admin pages
- `src/app/campaign-send/*` - Local-only campaign tool
- `src/app/test-*` - Test pages
- `src/app/simple-test/*` - Test pages
- `tracking/*` - Database migration scripts
- `.vercel/*` - Build artifacts

---

## 6. Visual Output Description

### Demo Page Visual Elements
- **Background:** Pure black (#000000)
- **Main Element:** 3D animated orb using Three.js
- **Orb Appearance:** Glowing sphere with teal/cyan color scheme, responds to audio
- **Backdrop:** Subtle particle/shader effects
- **Controls:** Circular microphone button (bottom center), settings gear (dev mode only)
- **Closed Captions:** White text on semi-transparent black background, appears above controls
- **Status Text:** Small text below controls showing connection/recording status

### Landing Page Visual Elements
- **Color Scheme:** Black background (#000000), teal accents (#14b8a6), white text
- **Hero Section:** Two-column layout with waveform animation visualization
- **Particles:** Floating teal particles in background (30 particles, animated)
- **Typography:** Inter font family, bold headlines, smooth gradients
- **Cards:** Glassmorphism style with subtle borders and backdrop blur
- **Calculator:** Interactive sliders with real-time calculations
- **Testimonials:** Three-column grid with avatar images and metrics
- **Pricing Cards:** Featured card highlighted, hover effects

---

## 7. Next Steps

1. **Sync AudioOrb3D** - Copy latest version from source
2. **Copy API routes** - Start with `/api/token` and `/api/leads`
3. **Copy lib files** - CalendarFunctions.ts, storage.ts
4. **Copy prompts** - generic.md and others as needed
5. **Copy landing page** - page.tsx, styles.module.css, logo.png
6. **Copy public assets** - Images, videos, favicon
7. **Install dependencies** - @deepgram/sdk, nodemailer, etc.
8. **Configure environment** - Set up .env.local
9. **Test demo page** - Verify voice agent works
10. **Test landing page** - Verify styling and interactions

---

*End of Phase 1 Analysis*
