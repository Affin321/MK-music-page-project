// main.js

const LATEST_JSON_PATH = "./data/latest.json";
const FALLBACK_VIDEO_ID = "S3M_Z2CdGqg";

function isValidYouTubeId(id) {
  return typeof id === "string" && /^[a-zA-Z0-9_-]{11}$/.test(id);
}

function buildEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed: ${url} (HTTP ${res.status})`);
  return res.json();
}

async function loadLatestVideo() {
  const iframe = document.getElementById("latest-iframe");
  const meta = document.getElementById("latest-meta");

  // If index.html doesn't have this section, do nothing
  if (!iframe) return;

  // Start state (good UX)
  if (meta) meta.textContent = "Loading latest video…";

  try {
    const data = await fetchJson(LATEST_JSON_PATH);
    const videoId = data.videoId;

    if (!isValidYouTubeId(videoId)) {
      throw new Error("Invalid videoId in latest.json");
    }

    // Only set src if valid (progressive enhancement)
    iframe.src = buildEmbedUrl(videoId);

    const title = typeof data.title === "string" ? data.title : "";
    const updatedAt = typeof data.updatedAt === "string" ? data.updatedAt : "";

    if (meta) {
      if (title) meta.textContent = `Now playing: ${title}`;
      else if (updatedAt) meta.textContent = `Updated: ${new Date(updatedAt).toLocaleString()}`;
      else meta.textContent = "";
    }
  } catch (err) {
    console.error("Latest video load failed:", err);

    // Do NOT overwrite iframe.src here.
    // Keep the HTML fallback video already in the iframe.
    if (meta) meta.textContent = "Latest video temporarily unavailable — showing fallback.";
  }
}

document.addEventListener("DOMContentLoaded", loadLatestVideo);