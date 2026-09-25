import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { 
  getYearData, 
  getAllYearsMetadata, 
  DECADES_DATA, 
  HISTORICAL_DATABASE 
} from "./server/dataset";
import { fetchWikimediaYearSummary, fetchWikimediaIndiaSummary } from "./server/wikipediaService";
import { generateHistoricalDispatch, generateComparisonInsights } from "./server/geminiService";
import { BirthdateCapsule, GlobalSearchResult, HistoricalEvent } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Health
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    service: "TIME MACHINE API",
    version: "1.0.0",
    timeframe: "1990-2026",
    geminiEnabled: !!process.env.GEMINI_API_KEY
  });
});

// 9.1 Years List
app.get("/api/v1/years", (_req, res) => {
  const metadata = getAllYearsMetadata();
  res.json(metadata);
});

// 9.1 Single Year Detailed Bundle
app.get("/api/v1/years/:year", async (req, res) => {
  const yearNum = parseInt(req.params.year, 10);
  if (isNaN(yearNum) || yearNum < 1990 || yearNum > 2026) {
    return res.status(400).json({ error: "Please provide a valid year between 1990 and 2026." });
  }

  const yearData = getYearData(yearNum);
  res.json(yearData);
});

// 9.2 & 9.3 Events with filtering (year, category, q)
app.get("/api/v1/events", (req, res) => {
  const yearParam = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
  const categoryParam = (req.query.category as string)?.toUpperCase();
  const q = (req.query.q as string)?.toLowerCase();

  let allEvents: HistoricalEvent[] = [];

  if (yearParam && !isNaN(yearParam)) {
    const yData = getYearData(yearParam);
    allEvents = [...yData.events];
  } else {
    for (let y = 1990; y <= 2026; y++) {
      allEvents.push(...getYearData(y).events);
    }
  }

  let filtered = allEvents;

  if (categoryParam && categoryParam !== "ALL") {
    filtered = filtered.filter(e => e.category === categoryParam);
  }

  if (q) {
    filtered = filtered.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.shortDescription.toLowerCase().includes(q) || 
      e.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json(filtered);
});

// 9.7 Event Details
app.get("/api/v1/events/:id", (req, res) => {
  const eventId = req.params.id;
  for (let y = 1990; y <= 2026; y++) {
    const yData = getYearData(y);
    const found = yData.events.find(e => e.id === eventId);
    if (found) {
      // Find related events in same year or category
      const related = yData.events.filter(e => e.id !== eventId).slice(0, 3);
      return res.json({ event: found, related, yearOverview: yData.tagline });
    }
  }
  res.status(404).json({ error: "Historical event not found" });
});

// 9.4 Movies
app.get("/api/v1/movies", (req, res) => {
  const yearParam = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
  if (yearParam && !isNaN(yearParam)) {
    const yData = getYearData(yearParam);
    return res.json(yData.movies);
  }

  const allMovies = [];
  for (let y = 1990; y <= 2026; y++) {
    allMovies.push(...getYearData(y).movies);
  }
  res.json(allMovies);
});

// 9.5 Music
app.get("/api/v1/music", (req, res) => {
  const yearParam = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
  if (yearParam && !isNaN(yearParam)) {
    const yData = getYearData(yearParam);
    return res.json(yData.music);
  }

  const allMusic = [];
  for (let y = 1990; y <= 2026; y++) {
    allMusic.push(...getYearData(y).music);
  }
  res.json(allMusic);
});

// Music Preview Audio Search & Cache
const musicPreviewCache = new Map<string, string>();

app.get("/api/v1/music/preview", async (req, res) => {
  const title = (req.query.title as string || "").trim();
  const artist = (req.query.artist as string || "").trim();

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const cacheKey = `${title}-${artist}`.toLowerCase();
  if (musicPreviewCache.has(cacheKey)) {
    return res.json({ previewUrl: musicPreviewCache.get(cacheKey) });
  }

  // Clean strings
  const cleanTitle = title.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
  const primaryArtist = artist.split(/&|,|ft\.|feat\./i)[0].trim();

  const searchQueries = [
    `${cleanTitle} ${primaryArtist}`,
    `${title} ${artist}`,
    cleanTitle,
    `${title}`
  ].filter((q, idx, arr) => q && arr.indexOf(q) === idx);

  for (const q of searchQueries) {
    try {
      const searchTerm = encodeURIComponent(q);
      const itunesRes = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=song&limit=3`, {
        headers: { "User-Agent": "TimeMachine/1.0" }
      });

      if (itunesRes.ok) {
        const data: any = await itunesRes.json();
        if (data.results && data.results.length > 0) {
          const matched = data.results.find((r: any) => r.previewUrl) || data.results[0];
          if (matched && matched.previewUrl) {
            musicPreviewCache.set(cacheKey, matched.previewUrl);
            return res.json({
              previewUrl: matched.previewUrl,
              trackName: matched.trackName,
              artistName: matched.artistName
            });
          }
        }
      }
    } catch {
      // try next query
    }
  }

  res.json({ previewUrl: null });
});

// Technology
app.get("/api/v1/technology", (req, res) => {
  const yearParam = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
  if (yearParam && !isNaN(yearParam)) {
    const yData = getYearData(yearParam);
    return res.json(yData.technology);
  }

  const allTech = [];
  for (let y = 1990; y <= 2026; y++) {
    allTech.push(...getYearData(y).technology);
  }
  res.json(allTech);
});

// 9.6 Global Search
app.get("/api/v1/search", (req, res) => {
  const query = (req.query.q as string || "").trim().toLowerCase();
  if (!query) {
    return res.json([]);
  }

  const results: GlobalSearchResult[] = [];

  for (let y = 1990; y <= 2026; y++) {
    const yData = getYearData(y);

    // Search events
    for (const evt of yData.events) {
      if (
        evt.title.toLowerCase().includes(query) ||
        evt.shortDescription.toLowerCase().includes(query) ||
        evt.fullDescription.toLowerCase().includes(query) ||
        evt.tags.some(t => t.toLowerCase().includes(query))
      ) {
        results.push({
          type: 'EVENT',
          id: evt.id,
          year: evt.year,
          title: evt.title,
          subtitle: `${evt.category.replace('_', ' ')} • ${evt.displayDate}`,
          category: evt.category,
          imageUrl: evt.imageUrl,
          snippet: evt.shortDescription
        });
      }
    }

    // Search movies
    for (const mov of yData.movies) {
      if (
        mov.title.toLowerCase().includes(query) ||
        mov.director.toLowerCase().includes(query) ||
        mov.cast.some(c => c.toLowerCase().includes(query)) ||
        mov.genres.some(g => g.toLowerCase().includes(query))
      ) {
        results.push({
          type: 'MOVIE',
          id: mov.id,
          year: mov.year,
          title: mov.title,
          subtitle: `Directed by ${mov.director} • ${mov.genres.join(', ')}`,
          category: 'CINEMA',
          imageUrl: mov.posterUrl,
          snippet: mov.overview
        });
      }
    }

    // Search music
    for (const mus of yData.music) {
      if (
        mus.title.toLowerCase().includes(query) ||
        mus.artist.toLowerCase().includes(query) ||
        mus.album.toLowerCase().includes(query) ||
        mus.genres.some(g => g.toLowerCase().includes(query))
      ) {
        results.push({
          type: 'MUSIC',
          id: mus.id,
          year: mus.year,
          title: mus.title,
          subtitle: `${mus.artist} • ${mus.album}`,
          category: 'MUSIC',
          imageUrl: mus.coverUrl,
          snippet: mus.notableAchievement
        });
      }
    }

    // Search Tech
    for (const tech of yData.technology) {
      if (
        tech.title.toLowerCase().includes(query) ||
        tech.company.toLowerCase().includes(query) ||
        tech.description.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'TECH',
          id: tech.id,
          year: tech.year,
          title: tech.title,
          subtitle: `${tech.company} • ${tech.category}`,
          category: 'TECHNOLOGY',
          imageUrl: tech.imageUrl,
          snippet: tech.description
        });
      }
    }
  }

  // Limit to top 40 results
  res.json(results.slice(0, 40));
});

// 12.1 Birth Date Mode / Time Capsule
app.get("/api/v1/birthdate", (req, res) => {
  const dateStr = req.query.date as string; // YYYY-MM-DD
  if (!dateStr) {
    return res.status(400).json({ error: "Please provide a valid date in YYYY-MM-DD format." });
  }

  const parts = dateStr.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || year < 1990 || year > 2026) {
    return res.status(400).json({ error: "Supported birth years are between 1990 and 2026." });
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[(month - 1) % 12] || "Birth Month";

  const yData = getYearData(year);
  const ageToday = 2026 - year;

  // Curate birthday capsule
  const capsule: BirthdateCapsule = {
    inputDate: dateStr,
    year,
    monthName,
    day: day || 1,
    ageToday,
    onThisDayEvents: yData.events.slice(0, 3),
    eraSummary: `When you entered the world in ${year}, humanity was navigating ${yData.tagline.toLowerCase()}`,
    topMovieAtBirth: yData.movies[0] || {
      id: "bm-1",
      year,
      title: `Blockbuster of ${year}`,
      releaseDate: `${year}-01-01`,
      director: "Cinema Master",
      cast: ["Hollywood & Global Icons"],
      genres: ["Adventure"],
      rating: 8.5,
      overview: "Dominating theatres worldwide during your birth season.",
      posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
      originCountry: "Global",
      source: {
        sourceName: "TMDB",
        sourceUrl: "https://themoviedb.org",
        sourceType: "TMDB",
        verified: true
      }
    },
    topSongAtBirth: yData.music[0] || {
      id: "bs-1",
      year,
      title: `Radio Sensation of ${year}`,
      artist: "Chart Topping Artist",
      album: `Hits of ${year}`,
      releaseDate: `${year}-01-01`,
      genres: ["Pop"],
      coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
      notableAchievement: "#1 Global anthem blasting from car radios & boomboxes.",
      originCountry: "Global",
      source: {
        sourceName: "MusicBrainz",
        sourceUrl: "https://musicbrainz.org",
        sourceType: "MUSICBRAINZ",
        verified: true
      }
    },
    techLandscapeAtBirth: yData.technology[0] || {
      id: "bt-1",
      year,
      date: `${year}-01-01`,
      title: "State of Tech at Your Birth",
      company: "Tech Pioneer",
      category: "COMPUTING",
      description: `In ${year}, people communicated primarily through ${yData.thenVsNow[0]?.pastValue || 'wired landlines and physical letters'}.`,
      impact: "The digital foundations being laid during your infancy.",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
      source: {
        sourceName: "Tech Archives",
        sourceUrl: "https://en.wikipedia.org",
        sourceType: "WIKIMEDIA",
        verified: true
      }
    },
    funTrivia: [
      `World population in ${year} was approximately ${yData.statistics.worldPopulation} (compared to 8.24 Billion in 2026).`,
      `Internet penetration in ${year} was only ~${yData.statistics.globalInternetUsers}.`,
      `India's GDP at your birth was a fraction of today's $4.1+ Trillion economy.`,
      `Best Picture at the Oscars in your birth era was '${yData.statistics.bestPictureWinner || 'Cinema Masterpieces'}'.`
    ]
  };

  res.json(capsule);
});

// 12.2 Then vs Now Comparison
app.get("/api/v1/compare", async (req, res) => {
  const year1 = parseInt(req.query.year1 as string || "1995", 10);
  const year2 = parseInt(req.query.year2 as string || "2026", 10);

  const data1 = getYearData(Math.min(Math.max(1990, year1), 2026));
  const data2 = getYearData(Math.min(Math.max(1990, year2), 2026));

  const aiInsights = await generateComparisonInsights(data1.year, data2.year);

  res.json({
    year1: {
      year: data1.year,
      title: data1.title,
      summary: data1.summary,
      statistics: data1.statistics,
      metrics: data1.thenVsNow
    },
    year2: {
      year: data2.year,
      title: data2.title,
      summary: data2.summary,
      statistics: data2.statistics,
      metrics: data2.thenVsNow
    },
    aiInsights
  });
});

// 12.3 Decades
app.get("/api/v1/decades", (_req, res) => {
  res.json(DECADES_DATA);
});

app.get("/api/v1/decades/:decade", (req, res) => {
  const decNum = parseInt(req.params.decade, 10);
  const found = DECADES_DATA.find(d => d.decade === decNum);
  if (!found) {
    return res.status(404).json({ error: "Decade not found (supported: 1990, 2000, 2010, 2020)" });
  }
  res.json(found);
});

// Wikimedia Live Proxy
app.get("/api/v1/wikipedia-live/:year", async (req, res) => {
  const y = parseInt(req.params.year, 10);
  if (isNaN(y) || y < 1990 || y > 2026) {
    return res.status(400).json({ error: "Invalid year" });
  }

  const [worldWiki, indiaWiki] = await Promise.all([
    fetchWikimediaYearSummary(y),
    fetchWikimediaIndiaSummary(y)
  ]);

  res.json({
    year: y,
    worldWiki,
    indiaWiki
  });
});

// AI Historical Deep Dive
app.post("/api/v1/ai-insights", async (req, res) => {
  const { year, query } = req.body;
  const yearNum = parseInt(year, 10) || 1995;
  const yData = getYearData(yearNum);

  const context = `Year: ${yData.year} (${yData.eraMoniker})
Summary: ${yData.summary}
India Highlights: ${yData.indiaSummary}
Key Themes: ${yData.keyThemes.join(', ')}
Query or Focus: ${query || 'General historical narrative'}`;

  const dispatch = await generateHistoricalDispatch(yearNum, context);
  res.json({ year: yearNum, ...dispatch });
});

// Vite middleware / static handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TIME MACHINE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
