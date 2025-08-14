export type ListingImage = { file: string; alt?: string };
export type ListingManifest = { version: number; images: ListingImage[] };

const cache = new Map<string, string[]>();

/** Ensure paths work both locally and on GitHub Pages (/flatmatch/). */
function base(relative: string): string {
  const clean = relative.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}

/** Load image URLs for a listing via its public manifest. Caches results. */
export async function loadListingImages(listingId: string): Promise<string[]> {
  if (cache.has(listingId)) return cache.get(listingId)!;

  const manifestUrl = base(`images/listings/${listingId}/manifest.json`);
  try {
    const res = await fetch(manifestUrl, { cache: "no-store" }); // easier to debug in dev
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const manifest = (await res.json()) as ListingManifest;

    const folder = base(`images/listings/${listingId}/`);
    const urls = (manifest.images ?? []).map(img => `${folder}${img.file}`);
    cache.set(listingId, urls);
    return urls;
  } catch (err) {
    // Debug hint in console
    console.warn(`[images] manifest load failed for ${listingId}:`, err);

    // Try jpg then webp
    const jpg = base("images/placeholder.jpg");
    const webp = base("images/placeholder.webp");
    cache.set(listingId, [jpg]); // set something immediately

    // try to detect which exists (optional – keeps console quiet in prod)
    try {
      const r = await fetch(jpg, { method: "HEAD" });
      cache.set(listingId, [r.ok ? jpg : webp]);
    } catch {
      cache.set(listingId, [webp]);
    }
    return cache.get(listingId)!;
  }
}

/** Optional: warm the cache for a set of listing IDs. */
export async function preloadListingImages(ids: string[]) {
  await Promise.allSettled(ids.map(id => loadListingImages(id)));
}
