# TIME MACHINE (1990 – 2026) ⏳✨

> An immersive, full-stack historical time machine chronicling **36 extraordinary years** of world history, India milestones, cinema, music, technology, science, sports, and cultural phenomena from **1990 to 2026**.

[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini API](https://img.shields.io/badge/Gemini_API-@google/genai-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Interactive 36-Year Timeline](#1-interactive-36-year-timeline-19902026)
  - [Gateway Splash Screen & Retro Time Warp Deck](#2-gateway-splash-screen--retro-time-warp-deck)
  - [Birthdate Time Capsule Mode](#3-birthdate-time-capsule-mode)
  - [Life Journey Mode](#4-life-journey-mode)
  - [Then vs. Now & Inflation Comparator](#5-then-vs-now--inflation-comparator)
  - [Cinema, Music & Cassette Player](#6-cinema-music--retro-cassette-player)
  - [Interactive Historical Map](#7-interactive-historical-world-map)
  - [AI Historical Dispatch (Gemini API)](#8-ai-historical-dispatch--narratives)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Directory Structure](#-directory-structure)
- [REST API Reference](#-rest-api-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Data Provenance & Verification](#-data-provenance--verification)
- [Contributing & License](#-license)

---

## 🌟 Overview

**Remix TIME MACHINE** bridges the gap between encyclopedic history and nostalgic multimedia exploration. Whether you want to travel back to the launch of the World Wide Web in 1991, relive the Y2K millennium transition, unseal what song was #1 on Billboard the exact day you were born, or analyze how purchasing power shifted from 1995 to 2026, TIME MACHINE offers a responsive, museum-grade web application.

The application features a curated multi-decade dataset enriched with live Wikipedia summaries, streaming 30-second audio previews, theatrical trailers, and generative AI historical dispatches powered by Google Gemini.

---

## 🚀 Key Features

### 1. Interactive 36-Year Timeline (1990–2026)
- **Year Scrubbing & Selection**: Smooth horizontal scrub bar traversing every year from 1990 through 2026 with era labels (*The 90s Genesis, Y2K Millennium, 2010s Digital Era, Present Frontier*).
- **8 Distinct Category Filters**:
  - 🌍 **World Events**: Global geopolitics, treaties, milestones, and breakthroughs.
  - 🇮🇳 **India Milestones**: Economic liberalization (1991), Pokhran-II, Chandrayaan missions, UPI revolution, infrastructure leaps.
  - 💻 **Technology**: The evolution of personal computers, smartphones, broadband, AI, and robotics.
  - 🎬 **Movies**: Blockbusters, Oscar winners, Bollywood classics, box-office stats, and embedded trailers.
  - 🎵 **Music**: Chart-topping hits, cassette/CD culture, Grammy winners, and audio previews.
  - 🔬 **Science**: Hubble launch, Human Genome Project, CERN Higgs boson, Mars rovers, quantum computing.
  - 🏆 **Sports**: World Cups, Olympic triumphs, legendary athlete milestones.
  - 🎨 **Culture & Trends**: Iconic memes, fashion aesthetics, gaming consoles, and societal shifts.
- **Exact Date Explorer**: Drill down into specific months and days within any selected year.

### 2. Gateway Splash Screen & Retro Time Warp Deck
- **App Splash Screen (`AppSplashScreen`)**: An elegant celestial astrolabe interface that boots subsystem diagnostics on initial load or browser refresh, offering 1-click era preset departure buttons and ambient audio chimes.
- **Chrono-Tek TM-90 Time Warp Console (`TimeTravelLoadingScreen`)**: Triggered when jumping across eras:
  - Authentic 1990s industrial brushed-chassis design with 4-corner rivets and status LEDs.
  - 3-tier DeLorean nixie digital circuits displaying Departure Year, Active Odometer Roll, and Target Year.
  - Directional traversal dynamics (*Retrograde Rewind ⏪* for past traversal vs. *Chrono Acceleration ⏩* for forward warp).
  - Twitching analog VU meters (Flux GW & Chrono Hz) and synthesizer tones (mechanical relays, dial-up carrier tones).
  - MS-DOS 6.22 CRT screen with green raster scanlines and real-time historical relic buffering logs.

### 3. Birthdate Time Capsule Mode
- Enter any date of birth between January 1, 1990 and the present.
- **Chrono-Capsule Unsealing Chamber**: Animated decryption sequence aligning solar coordinates, box office archives, and Billboard charts.
- Uncovers:
  - Exact age calculated in solar years.
  - **#1 Song at Birth**: With direct 30-second audio preview playback.
  - **Top Movie at Birth**: Cover art, director, synopsis, and awards.
  - **State of Technology**: Hardware specs and communication landscape during birth month.
  - **"On This Day" Headlines**: Major historical happenings during your arrival.
  - **Trivia & Era Comparisons**: World population, internet penetration, and economic metrics then vs. today.
  - **Export & Share**: Generate a vintage printable newspaper clipping card using `html-to-image`.

### 4. Life Journey Mode
- Input your birth year and watch history unfold in sync with your personal growth.
- Displays defining cultural, technological, and global moments that occurred as you turned **Age 1, 5, 10, 16, 18, 21, 25, 30+**.

### 5. Then vs. Now & Inflation Comparator
- Compare any two historical years side-by-side (e.g., 1995 vs. 2026).
- **Macro Metric Cards**:
  - Global Population & Internet Penetration.
  - Price of Crude Oil, Movie Tickets, and Gold.
  - Leading Global Corporations & Tech Giants.
- **Purchasing Power Calculator**: Real-time US and Indian inflation calculations adjusting historical currency to today's purchasing power.
- **AI Comparative Insights**: Gemini-powered macro-shift summary contrasting societal paradigms between the two chosen dates.

### 6. Cinema, Music & Retro Cassette Player
- **Cinema Theater Modal**: Watch official YouTube trailers, browse full cast, director profiles, and box office earnings.
- **Cassette Tape Player (`RetroCassetteModal`)**: Experience 90s/00s music with animated reel-to-reel cassette spools, track metadata, and real 30-second audio streaming via the iTunes Search API proxy.
- **Global Audio Bar**: Ambient retro soundtrack and preview player that persists while browsing the application.

### 7. Interactive Historical World Map
- Interactive map plotting historical events by geographic coordinates.
- Filter locations by category to visualize geopolitical events, scientific discovery sites, and cultural landmarks across continents.

### 8. AI Historical Dispatch & Narratives
- Server-side integration with **Google Gemini (`gemini-2.5-flash`)** using `@google/genai`.
- Generates vintage journalistic news dispatches, deep-dive historical retrospectives, and context-aware answers to user queries.

---

## 🛠 Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                 Client (React 19 + Vite)                │
│  Tailwind CSS v4 • Motion/React • Lucide • HTML-to-Image │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP /api/v1/*
┌────────────────────────────▼────────────────────────────┐
│              Server (Node.js + Express + TSX)            │
│  Dataset Engine • Caching Layer • Vite Dev Middleware   │
└──────────────┬───────────────────────────┬──────────────┘
               │                           │
┌──────────────▼──────────────┐ ┌──────────▼──────────────┐
│       Google Gemini API     │ │    External Live Proxies │
│  @google/genai SDK (v2.4+)  │ │  • Wikipedia REST API   │
│  Model: gemini-2.5-flash     │ │  • iTunes Search Audio  │
└─────────────────────────────┘ └─────────────────────────┘
```

### Frontend
- **Framework**: React 19 (`react`, `react-dom`)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, `@import "tailwindcss";`)
- **Animation & Physics**: Motion (`motion/react`)
- **Iconography**: Lucide React (`lucide-react`)
- **Visual Effects**: Canvas Confetti (`canvas-confetti`)
- **DOM Imaging**: `html-to-image` for generating vintage card exports

### Backend & Tooling
- **Server**: Express 4.21 with TypeScript (`tsx`, `esbuild`)
- **Bundler**: Vite 6.2 with `@vitejs/plugin-react`
- **Environment**: `dotenv`
- **AI SDK**: `@google/genai` (v2.4.0)
- **Audio Synthesis**: Native HTML5 Web Audio API (oscillators, biquad filters, gain ramping)

---

## 📁 Directory Structure

```
├── .env.example                 # Example environment secrets configuration
├── metadata.json                # AI Studio applet manifest & permissions
├── package.json                 # Project dependencies and npm scripts
├── server.ts                    # Full-stack Express entry point & API routes
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with React & Tailwind v4
│
├── server/                      # Backend services and data models
│   ├── dataset.ts               # 1990–2026 curated master historical database
│   ├── geminiService.ts         # Google Gemini AI prompt orchestration
│   ├── wikipediaService.ts      # Live Wikipedia API query & parsing service
│   ├── yearlyCulture.ts         # Memes, slang, fashion, and cultural markers
│   └── yearlyMedia.ts           # Cinema records, trailers, and music archives
│
└── src/                         # Frontend application source
    ├── main.tsx                 # Application DOM entry point
    ├── App.tsx                  # Root state orchestration & view routing
    ├── index.css                # Tailwind CSS v4 root import & design tokens
    ├── types.ts                 # Shared TypeScript interfaces & types
    │
    ├── components/              # Modular UI components
    │   ├── AppSplashScreen.tsx             # Initial site load gateway & diagnostics
    │   ├── TimeTravelLoadingScreen.tsx     # Industrial Chrono-Tek TM-90 warp console
    │   ├── BirthCapsuleLoadingScreen.tsx   # Unsealing chamber animation
    │   ├── BirthdateMode.tsx               # Birthday time capsule generator
    │   ├── LifeJourneyMode.tsx             # Personal age-aligned milestone viewer
    │   ├── ThenVsNowModal.tsx              # Year-over-year macro comparator
    │   ├── InflationCalculatorModal.tsx    # Currency & purchasing power tool
    │   ├── DecadeExplorer.tsx              # Decade-level overviews (90s, 00s, 10s, 20s)
    │   ├── Timeline.tsx                    # Chronological event stream
    │   ├── TimelineEventCard.tsx           # Event cards with verified provenance
    │   ├── EventModal.tsx                  # Event deep-dive modal
    │   ├── MovieCard.tsx                   # Cinema poster card
    │   ├── MovieTrailerModal.tsx           # Embedded YouTube video player
    │   ├── MusicCard.tsx                   # Album art card with audio trigger
    │   ├── RetroCassetteModal.tsx          # Mechanical cassette tape deck
    │   ├── TechnologyCard.tsx              # Tech breakthrough display card
    │   ├── TechEvolutionComparator.tsx     # 4-category tech evolution matrix
    │   ├── HistoricalMap.tsx               # Event geolocation interactive map
    │   ├── TimeTravelerDispatch.tsx        # Gemini AI vintage newsroom dispatch
    │   ├── VintageTimeCapsuleModal.tsx     # Exportable newspaper clipping generator
    │   ├── GlobalSearchModal.tsx           # Multi-category instant search modal
    │   ├── SavedBookmarksModal.tsx         # User-saved favorite events
    │   ├── YearSelector.tsx                # Interactive 1990-2026 scrub bar
    │   ├── CategoryFilter.tsx              # 8-pill category navigation
    │   ├── ExactDateExplorer.tsx           # Month & day calendar filter
    │   ├── GlobalAudioBar.tsx              # Bottom audio player dock
    │   └── Header.tsx                      # Top navigation bar & quick actions
    │
    └── services/
        └── api.ts               # Frontend HTTP client for Express backend
```

---

## 📡 REST API Reference

The backend exposes a clean REST API running on port `3000`:

| Method | Endpoint | Description | Query Parameters |
|:-------|:---------|:------------|:-----------------|
| `GET` | `/api/health` | Service health check and Gemini status | None |
| `GET` | `/api/v1/years` | Metadata list for all 36 years (1990–2026) | None |
| `GET` | `/api/v1/years/:year` | Full data bundle for a specific year | None |
| `GET` | `/api/v1/events` | List events with category & search filters | `year`, `category`, `q` |
| `GET` | `/api/v1/events/:id` | Event detail with related events & citations | None |
| `GET` | `/api/v1/movies` | Cinema archive for a given year or all years | `year` |
| `GET` | `/api/v1/music` | Music records for a given year or all years | `year` |
| `GET` | `/api/v1/music/preview` | 30-second audio stream URL preview | `title`, `artist` |
| `GET` | `/api/v1/technology` | Tech milestone cards and spec highlights | `year` |
| `GET` | `/api/v1/search` | Global instant search across events, movies, songs, & tech | `q` (required) |
| `GET` | `/api/v1/birthdate` | Complete personalized Birthdate Time Capsule | `date` (`YYYY-MM-DD`) |
| `GET` | `/api/v1/compare` | Macro metrics and AI comparison between two years | `year1`, `year2` |
| `GET` | `/api/v1/decades` | Decade summaries (1990, 2000, 2010, 2020) | None |
| `GET` | `/api/v1/decades/:decade` | Deep-dive data for an individual decade | None |
| `GET` | `/api/v1/wikipedia-live/:year` | Live Wikipedia summary proxy (World & India) | None |
| `POST` | `/api/v1/ai-insights` | Generate Gemini AI narrative historical dispatch | Body: `{ year, query }` |

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v20.x or later
- **npm** or **bun** / **pnpm**

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   git clone <repo-url>
   cd remix-time-machine
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the project root (reference `.env.example`):

```env
# Optional: Google Gemini API Key for AI Historical Dispatches & Compare Insights
# If running inside Google AI Studio, this is injected automatically.
GEMINI_API_KEY="your-gemini-api-key-here"

# Application host URL
APP_URL="http://localhost:3000"
```

> **Note**: If `GEMINI_API_KEY` is omitted, the application operates normally with intelligent pre-computed fallbacks for all comparisons and historical dispatches.

### Development Server

Start the full-stack server (runs Express with integrated Vite middleware on port `3000`):

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

### Production Build

Build the optimized client bundle and compile the server bundle:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Run TypeScript verification:

```bash
npm run lint
```

---

## 🔍 Data Provenance & Verification

To ensure academic and historical integrity, every event, movie, and musical piece includes a `source` provenance schema:

```typescript
export interface SourceProvenance {
  sourceName: string;
  sourceUrl: string;
  sourceType: 'WIKIMEDIA' | 'TMDB' | 'MUSICBRAINZ' | 'OFFICIAL_ARCHIVE' | 'NEWS_RECORD';
  license?: string;
  verified: boolean;
  citationDate?: string;
}
```

- **Wikimedia & Official Archives**: Cross-referenced historical records, treaties, and speeches.
- **The Movie Database (TMDB)**: Curated box-office records, release dates, and director credits.
- **MusicBrainz & Billboard Archives**: Chart positions, album release calendars, and genre tags.
- **Inflation Metrics**: Grounded in official Bureau of Labor Statistics (CPI-U) and Reserve Bank of India historical price indexes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

Crafted with nostalgia and precision for historians, culture enthusiasts, and digital time travelers. 🕰️🚀

vedant saparia

