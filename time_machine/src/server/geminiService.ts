import { GoogleGenAI } from "@google/genai";
import { HISTORICAL_DATABASE } from "./dataset";

interface HistoricalDispatch {
  dispatch: string;
  keyAtmosphere: string;
  culturalVibe: string;
  historicalSignificance: string;
}

interface ComparisonInsights {
  narrative: string;
  biggestShift: string;
  technologicalLeap: string;
  culturalContrast: string;
}

// In-memory cache for instant response & zero rate-limit waste
const dispatchCache = new Map<number, HistoricalDispatch>();
const comparisonCache = new Map<string, ComparisonInsights>();
const pendingDispatches = new Map<number, Promise<HistoricalDispatch>>();
const pendingComparisons = new Map<string, Promise<ComparisonInsights>>();

// Circuit breaker: If quota limit (429) or service unavailable (503) occurs,
// avoid making external requests for a cooloff duration and serve rich curated archives directly.
let apiCooloffUntil = 0;

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

function buildFallbackDispatch(year: number): HistoricalDispatch {
  const yData = HISTORICAL_DATABASE[year];
  if (!yData) {
    return {
      dispatch: `Walking the streets in ${year}, one could immediately sense an era caught between traditional daily rituals and the accelerating current of global progress. Newsstands and television broadcasts echoed conversations about landmark transformations, shifting international alliances, and the quiet arrival of innovations that would soon redefine modern existence.`,
      keyAtmosphere: `A period of decisive transition, marked by socio-economic dynamism and rapid technological adaptation.`,
      culturalVibe: `A distinctive blend of era-defining popular media, vibrant local expression, and physical community life.`,
      historicalSignificance: `Milestones from ${year} laid critical foundations for today's connected, digital, and interconnected world.`
    };
  }

  const firstEvent = yData.events[0]?.title || "pivotal world events";
  const secondEvent = yData.events[1]?.title || "key cultural milestones";
  const topMovie = yData.movies[0]?.title || "box office record-breakers";
  const topMusic = yData.music[0]?.title || "chart-topping anthems";
  const techPoint = yData.technology[0]?.title || "computing milestones";

  return {
    dispatch: `Stepping into ${year}, the world was defined by "${yData.tagline}". In the public square and across living rooms, conversations buzzed with developments around ${firstEvent} alongside ${secondEvent}. On radios and screens, works like "${topMusic}" and cinema blockbusters like "${topMovie}" provided the soundtrack and imagery to everyday life, while ${techPoint} began shifting how people communicated and processed information. ${yData.indiaSummary}`,
    keyAtmosphere: `${yData.eraMoniker}: ${yData.keyThemes.slice(0, 3).join(', ')}.`,
    culturalVibe: `Defined by '${topMovie}', '${topMusic}', and the rise of ${yData.thenVsNow[0]?.pastValue || 'physical media formats'}.`,
    historicalSignificance: `${yData.summary.slice(0, 160)}... These events decisively accelerated global history and modern development.`
  };
}

export async function generateHistoricalDispatch(year: number, context: string): Promise<HistoricalDispatch> {
  // 1. Check in-memory cache
  if (dispatchCache.has(year)) {
    return dispatchCache.get(year)!;
  }

  // 2. Check pending in-flight promise to avoid parallel duplicate requests
  if (pendingDispatches.has(year)) {
    return pendingDispatches.get(year)!;
  }

  // 3. If in circuit breaker cooloff (e.g. quota exhausted), immediately serve fallback
  if (Date.now() < apiCooloffUntil) {
    const fallback = buildFallbackDispatch(year);
    dispatchCache.set(year, fallback);
    return fallback;
  }

  const fetchPromise = (async () => {
    const ai = getAiClient();
    if (!ai) {
      const fallback = buildFallbackDispatch(year);
      dispatchCache.set(year, fallback);
      return fallback;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are a world-renowned historian and immersive time-travel chronicler.
Write an authentic, vivid 'Time Traveler's Dispatch' from the year ${year}.
Context data about this year:
${context}

Return your response in clean JSON format matching this schema:
{
  "dispatch": "A vivid 2-3 paragraph immersive narrative describing what it felt like to walk the streets, turn on the radio/TV, read the morning newspapers, and witness the epochal events of ${year}.",
  "keyAtmosphere": "One compelling sentence describing the geopolitical and social mood of ${year}.",
  "culturalVibe": "One compelling sentence summarizing fashion, music, cinema, and everyday lifestyle in ${year}.",
  "historicalSignificance": "Two concise sentences explaining why ${year} permanently changed humanity and India's trajectory."
}`,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are an objective, eloquent historian providing immersive cultural and historical synthesis.",
          temperature: 0.7
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text) as HistoricalDispatch;
        if (parsed.dispatch && parsed.keyAtmosphere) {
          dispatchCache.set(year, parsed);
          return parsed;
        }
      }
    } catch (error: any) {
      // If 429 quota or 503 unavailable, trigger circuit breaker for 3 minutes
      const errStatus = error?.status || error?.code || '';
      const errMsg = String(error?.message || '');
      if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED') || errStatus === 429 || errStatus === 'RESOURCE_EXHAUSTED' || errMsg.includes('503') || errStatus === 503) {
        apiCooloffUntil = Date.now() + 180000; // 3 minutes cooloff
      }
    }

    const fallback = buildFallbackDispatch(year);
    dispatchCache.set(year, fallback);
    return fallback;
  })();

  pendingDispatches.set(year, fetchPromise);
  try {
    const result = await fetchPromise;
    return result;
  } finally {
    pendingDispatches.delete(year);
  }
}

function buildFallbackComparison(year1: number, year2: number): ComparisonInsights {
  const yData1 = HISTORICAL_DATABASE[year1];
  const yData2 = HISTORICAL_DATABASE[year2];

  const diffYears = Math.abs(year2 - year1);
  const olderYear = Math.min(year1, year2);
  const newerYear = Math.max(year1, year2);

  const olderTitle = yData1 ? yData1.eraMoniker : `${olderYear}`;
  const newerTitle = yData2 ? yData2.eraMoniker : `${newerYear}`;

  return {
    narrative: `Contrasting ${year1} (${olderTitle}) with ${year2} (${newerTitle}) captures ${diffYears} years of exponential transformation. In ${olderYear}, daily life was anchored by physical media, localized networks, and emerging digital infrastructure, whereas ${newerYear} operates on ubiquitous artificial intelligence, hyper-connected cloud ecosystems, and high-speed financial rails. This evolution highlights how rapidly humanity's grandest technological experiments become ordinary daily utilities.`,
    biggestShift: `The transition from localized, analog, and siloed communication to instantaneous global intelligence and real-time connectivity.`,
    technologicalLeap: `Moving from dial-up modems and physical storage media to generative AI copilots, 5G/6G bandwidth, and cloud compute.`,
    culturalContrast: `A shift from shared linear mass-broadcasts to decentralized, on-demand, algorithmic personalization.`
  };
}

export async function generateComparisonInsights(year1: number, year2: number): Promise<ComparisonInsights> {
  const cacheKey = `${year1}-${year2}`;
  if (comparisonCache.has(cacheKey)) {
    return comparisonCache.get(cacheKey)!;
  }

  if (pendingComparisons.has(cacheKey)) {
    return pendingComparisons.get(cacheKey)!;
  }

  // If in cooloff, serve fallback immediately
  if (Date.now() < apiCooloffUntil) {
    const fallback = buildFallbackComparison(year1, year2);
    comparisonCache.set(cacheKey, fallback);
    return fallback;
  }

  const fetchPromise = (async () => {
    const ai = getAiClient();
    if (!ai) {
      const fallback = buildFallbackComparison(year1, year2);
      comparisonCache.set(cacheKey, fallback);
      return fallback;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Compare the year ${year1} with the year ${year2} across technology, everyday life, communication, culture, and India's global stature.
Return JSON with this schema:
{
  "narrative": "A 2-paragraph sharp historical comparison highlighting the profound differences.",
  "biggestShift": "One sentence describing the single biggest paradigm shift between these two points in time.",
  "technologicalLeap": "One sentence capturing the leap in speed, compute, or convenience.",
  "culturalContrast": "One sentence summarizing the aesthetic and cultural evolution."
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text) as ComparisonInsights;
        if (parsed.narrative && parsed.biggestShift) {
          comparisonCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (error: any) {
      const errStatus = error?.status || error?.code || '';
      const errMsg = String(error?.message || '');
      if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED') || errStatus === 429 || errStatus === 'RESOURCE_EXHAUSTED' || errMsg.includes('503') || errStatus === 503) {
        apiCooloffUntil = Date.now() + 180000;
      }
    }

    const fallback = buildFallbackComparison(year1, year2);
    comparisonCache.set(cacheKey, fallback);
    return fallback;
  })();

  pendingComparisons.set(cacheKey, fetchPromise);
  try {
    const result = await fetchPromise;
    return result;
  } finally {
    pendingComparisons.delete(cacheKey);
  }
}

