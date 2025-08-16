import type { Listing } from "../state/ListingsContext";

/** 10 near UoA + 5 North Shore + 3 West AKL (18 total). Images hydrate via manifest. */
export const popularMock: Listing[] = [
  { id: "uoa-001", title: "Sunny Double Room by Albert Park", subtitle: "Auckland CBD • 0.4 km to UoA", type: "1BR", loc: "Auckland CBD", km: 0.4, price: "350", saved: false, rating: 4.7, reviews: 38, images: [] },
  { id: "uoa-002", title: "Modern Studio near Grafton Campus", subtitle: "Grafton • 0.9 km to Med School", type: "Studio", loc: "Grafton", km: 0.9, price: "420", saved: false, rating: 4.6, reviews: 22, images: [] },
  { id: "uoa-003", title: "Parnell Loft with City Views", subtitle: "Parnell • 1.5 km to UoA", type: "1BR", loc: "Parnell", km: 1.5, price: "395", saved: false, rating: 4.8, reviews: 41, images: [] },
  { id: "uoa-004", title: "Newmarket En-suite in Quiet Street", subtitle: "Newmarket • 2.0 km to Campus", type: "1BR", loc: "Newmarket", km: 2.0, price: "380", saved: false, rating: 4.5, reviews: 19, images: [] },
  { id: "uoa-005", title: "Eden Terrace Single — UniLink", subtitle: "Eden Terrace • 1.8 km to UoA", type: "Flatmate", loc: "Eden Terrace", km: 1.8, price: "320", saved: false, rating: 4.4, reviews: 27, images: [] },
  { id: "uoa-006", title: "Ponsonby Character Room, Bills Inc.", subtitle: "Ponsonby • 2.6 km to UoA", type: "Flatmate", loc: "Ponsonby", km: 2.6, price: "360", saved: false, rating: 4.7, reviews: 55, images: [] },
  { id: "uoa-007", title: "Grafton Twin Room for Postgrads", subtitle: "Grafton • 1.1 km to Campus", type: "Flatmate", loc: "Grafton", km: 1.1, price: "300", saved: false, rating: 4.3, reviews: 12, images: [] },
  { id: "uoa-008", title: "En-suite by Britomart Transport", subtitle: "Downtown • 1.2 km to UoA", type: "Studio", loc: "Auckland CBD", km: 1.2, price: "430", saved: false, rating: 4.6, reviews: 33, images: [] },
  { id: "uoa-009", title: "K’Rd Studio — Cafés On Doorstep", subtitle: "Newton • 1.3 km to UoA", type: "Studio", loc: "Newton", km: 1.3, price: "370", saved: false, rating: 4.2, reviews: 18, images: [] },
  { id: "uoa-010", title: "Parnell Garden Room, Heritage Villa", subtitle: "Parnell • 1.8 km to UoA", type: "1BR", loc: "Parnell", km: 1.8, price: "345", saved: false, rating: 4.9, reviews: 44, images: [] },
];

export const nearbyMock: Listing[] = [
  // North Shore (5)
  { id: "ns-001", title: "Takapuna Beachside Double — 10 min Bus", subtitle: "Takapuna • Fast bus to City", type: "1BR", loc: "Takapuna", km: 7.8, price: "360", saved: false, rating: 4.5, reviews: 28, images: [] },
  { id: "ns-002", title: "Milford En-suite near Marina", subtitle: "Milford • Direct bus to UoA", type: "1BR", loc: "Milford", km: 9.1, price: "390", saved: false, rating: 4.6, reviews: 21, images: [] },
  { id: "ns-003", title: "Northcote Single, Easy Commute", subtitle: "Northcote • Busway access", type: "Flatmate", loc: "Northcote", km: 6.2, price: "310", saved: false, rating: 4.3, reviews: 17, images: [] },
  { id: "ns-004", title: "Albany Student Studio by Busway", subtitle: "Albany • Close to station", type: "Studio", loc: "Albany", km: 15.8, price: "340", saved: false, rating: 4.4, reviews: 24, images: [] },
  { id: "ns-005", title: "Devonport Villa Room, Ferry Access", subtitle: "Devonport • Ferry to CBD", type: "Flatmate", loc: "Devonport", km: 12.3, price: "365", saved: false, rating: 4.7, reviews: 29, images: [] },

  // West Auckland (3)
  { id: "west-001", title: "New Lynn Double near Train", subtitle: "New Lynn • Rail to City", type: "1BR", loc: "New Lynn", km: 10.6, price: "320", saved: false, rating: 4.2, reviews: 14, images: [] },
  { id: "west-002", title: "Henderson En-suite, Quiet Cul-de-sac", subtitle: "Henderson • Bus & Rail", type: "1BR", loc: "Henderson", km: 14.2, price: "330", saved: false, rating: 4.3, reviews: 16, images: [] },
  { id: "west-003", title: "Te Atatū South Studio — Motorway Close", subtitle: "Te Atatū South • SH16", type: "Studio", loc: "Te Atatū South", km: 12.8, price: "315", saved: false, rating: 4.1, reviews: 11, images: [] },
];

// --- Map support (non-breaking) ---------------------------------------------

/** Optional specific map addresses per listing id (fictional but plausible). */
export const mapAddressById: Record<string, string> = {
  // Near UoA (10)
  "uoa-001": "1 Princes Street, Auckland CBD 1010",
  "uoa-002": "85 Park Road, Grafton, Auckland 1023",
  "uoa-003": "14 St Georges Bay Road, Parnell, Auckland 1052",
  "uoa-004": "9 Teed Street, Newmarket, Auckland 1023",
  "uoa-005": "27 Basque Road, Eden Terrace, Auckland 1010",
  "uoa-006": "134 Ponsonby Road, Ponsonby, Auckland 1011",
  "uoa-007": "26 Carlton Gore Road, Grafton, Auckland 1023",
  "uoa-008": "11 Britomart Place, Auckland CBD 1010",
  "uoa-009": "341 Karangahape Road, Newton, Auckland 1010",
  "uoa-010": "31 St Stephens Avenue, Parnell, Auckland 1052",

  // North Shore (5)
  "ns-001": "48 Lake Road, Takapuna, Auckland 0622",
  "ns-002": "24 Milford Road, Milford, Auckland 0620",
  "ns-003": "2 College Road, Northcote, Auckland 0627",
  "ns-004": "3 Civic Crescent, Albany, Auckland 0632",
  "ns-005": "1 Victoria Road, Devonport, Auckland 0624",

  // West Auckland (3)
  "west-001": "3053 Great North Road, New Lynn, Auckland 0600",
  "west-002": "5 Railside Avenue, Henderson, Auckland 0612",
  "west-003": "182 Te Atatū Road, Te Atatū South, Auckland 0610",
};

/**
 * Build a destination string for maps/directions.
 * Falls back to a generic "title + loc + Auckland" if a specific address isn't mapped.
 */
export function getMapAddress(l: Listing): string {
  return mapAddressById[l.id] ?? `${l.title} ${('loc' in l && (l as any).loc) || ''} Auckland`.trim();
}
