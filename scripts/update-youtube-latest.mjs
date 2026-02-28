// scripts/update-youtube-latest.mjs
import { promises as fs } from "node:fs";
import path from "node:path";

const API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = process.env.YOUTUBE_UPLOADS_PLAYLIST_ID;
const OUT_FILE = "data/latest.json";

if (!API_KEY) {
  console.error("Missing env var: YOUTUBE_API_KEY");
  process.exit(1);
}
if (!PLAYLIST_ID) {
  console.error("Missing env var: YOUTUBE_UPLOADS_PLAYLIST_ID");
  process.exit(1);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, attempts = 4) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "mk-website-bot/1.0" },
      });

      // Retry transient issues
      if ([429, 500, 502, 503, 504].includes(res.status)) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} transient: ${body.slice(0, 200)}`);
      }

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 300)}`);
      }

      return await res.json();
    } catch (err) {
      lastErr = err;
      const backoff = Math.min(8000, 500 * 2 ** (i - 1));
      console.warn(`Attempt ${i}/${attempts} failed: ${err.message}`);
      if (i < attempts) await sleep(backoff);
    }
  }
  throw lastErr;
}

async function main() {
  // This playlistId should be the uploads playlist (starts with "UU...")
  const params = new URLSearchParams({
    key: API_KEY,
    part: "snippet",
    playlistId: PLAYLIST_ID,
    maxResults: "1",
  });

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`;
  const data = await fetchWithRetry(url);

  const item = data?.items?.[0];
  const videoId = item?.snippet?.resourceId?.videoId;
  if (!videoId) throw new Error("No videoId returned from YouTube API.");

  const title = item?.snippet?.title ?? "Latest video";
  const publishedAt = item?.snippet?.publishedAt ?? null;

  const payload = {
    videoId,
    title,
    publishedAt,
    updatedAt: new Date().toISOString(),
  };

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log(`Updated ${OUT_FILE} -> ${videoId}`);
}

main().catch((err) => {
  console.error("Update failed:", err.message);
  process.exit(1);
});