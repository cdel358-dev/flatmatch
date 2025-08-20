// src/data/mockFlatmates.ts
import type { Listing } from "../state/ListingsContext";
import { popularMock, nearbyMock } from "./mockListings";

export type Flatmate = {
  id: string;
  name: string;
  verified?: boolean;
  avatar?: string;
  about?: string;
  gender?: 'male' | 'female';
};


const fm = (
  id: string,
  name: string,
  about?: string,
  verified = true,
  avatar?: string
): Flatmate => ({ id, name, about, verified, avatar });

const BASE = (import.meta as any).env?.BASE_URL ?? '/';

// --- Names/bios pool (extend anytime) ---
const NAMES_MALE = [
  "Alex", "Sam", "Jordan", "Ari", "Taylor", "Morgan", "Casey",
  "Drew", "Parker", "Blake", "Rowan", "Logan", "Kai", "Elliot",
  "Jude", "Micah", "Hayden",
];
const NAMES_FEMALE = [
  "Riley", "Jamie", "Quinn", "Charlie", "Avery", "Harper",
  "Emerson", "Noa", "Reese", "Emerson", "Hayden", "Rowan",
];

const BIOS = [
  "Software engineer. Early riser. Loves cycling.",
  "Nurse working nights. Bakes on weekends.",
  "PhD student. Into indoor plants & pottery.",
  "Designer. Climbs on weekends.",
  "Barista. Cat person.",
  "Retail. Morning shifts.",
  "Musician. Quiet after 9pm.",
  "Hospitality. Works late.",
  "Grad student. Gym after work.",
  "Chef. Sunday meal-prep legend.",
  "Data analyst. Minimalist, tidy.",
  "ESL tutor. Loves board games.",
  "Pharmacist. Early bedtime.",
  "TA at UoA. Coffee aficionado.",
  "Paramedic. Calm and considerate.",
  "Lab tech. Keeps things clean.",
  "Startup ops. Into running.",
  "Researcher. Plants everywhere.",
  "QA tester. Quiet weekdays.",
  "Content creator. Vlogs cooking.",
];

// Simple deterministic PRNG from a string (listing id)
function seedFromString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function makeRng(seed: number) {
  // xorshift32
  let x = seed || 123456789;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    // uint32 to [0,1)
    return ((x >>> 0) / 0xffffffff);
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function buildCounts(listings: Listing[]) {
  const N = listings.length;
  const targetAvg = 3;                // overall average target
  const targetTotal = N * targetAvg;  // total flatmates across all listings
  const mustHave = Math.ceil(N * 0.9); // at least this many listings have >=1

  // Choose exactly (N - mustHave) listings to have 0 flatmates.
  // We'll pick the last few ids alphabetically for determinism.
  const sortedIds = [...listings.map(l => l.id)].sort();
  const zeros = new Set<string>(sortedIds.slice(-Math.max(0, N - mustHave)));

  // Initial counts:
  // - 0 for chosen "zero" ids
  // - for the rest, biased around 3 with min 1, max 5
  const counts: Record<string, number> = {};
  let sum = 0;

  for (const l of listings) {
    if (zeros.has(l.id)) {
      counts[l.id] = 0;
    } else {
      const rng = makeRng(seedFromString(l.id));
      // Distribution around 3 (mean ~3.125) then clamp 1..5
      const choices = [1, 2, 3, 3, 3, 4, 4, 5];
      const c = choices[Math.floor(rng() * choices.length)];
      counts[l.id] = Math.min(5, Math.max(1, c));
    }
    sum += counts[l.id];
  }

  // Balance pass to hit targetTotal exactly (while keeping 0..5 bounds and >=1 for non-zero listings)
  let diff = targetTotal - sum;
  if (diff !== 0) {
    // Work on the non-zero group first to keep "must-have" guarantee
    const adjustable = listings
      .map(l => l.id)
      .filter(id => !zeros.has(id));

    // Positive diff -> increment some counts up to 5
    // Negative diff -> decrement some counts down to 1
    let idx = 0;
    const step = (diff > 0) ? 1 : -1;

    while (diff !== 0 && adjustable.length > 0) {
      const id = adjustable[idx % adjustable.length];
      const cur = counts[id];

      const canInc = step > 0 && cur < 5;
      const canDec = step < 0 && cur > 1;

      if ((step > 0 && canInc) || (step < 0 && canDec)) {
        counts[id] = cur + step;
        diff -= step;
      }
      idx++;
      // If we cycle through too many times without progress, break (safety)
      if (idx > adjustable.length * 20) break;
    }

    // If still off (rare), allow touching zeros -> turn a few from 0→1 if needed
    if (diff > 0) {
      const zeroIds = [...zeros];
      let z = 0;
      while (diff > 0 && z < zeroIds.length) {
        const id = zeroIds[z++];
        if (counts[id] === 0) {
          counts[id] = 1;
          diff -= 1;
          zeros.delete(id); // now it has at least 1
        }
      }
    }
  }

  return counts;
}

function makeFlatmatesForListing(listing: Listing, count: number): Flatmate[] {
  if (count <= 0) return [];
  const rng = makeRng(seedFromString(listing.id));
  const out: Flatmate[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    // 🎯 60% female, 40% male
    const gender: 'male' | 'female' = rng() < 0.6 ? 'female' : 'male';
    const pool = gender === 'male' ? NAMES_MALE : NAMES_FEMALE;

    // Pick unique name
    let name = pick(rng, pool);
    let attempts = 0;
    while (usedNames.has(name) && attempts < 5) {
      name = pick(rng, pool);
      attempts++;
    }
    usedNames.add(name);

    const about = pick(rng, BIOS);

    // Cycle avatars in gendered folders
    const avatarIndex = (seedFromString(listing.id) + i) % 10; // assume 10 per gender
    // const avatar = `/images/flatmates/${gender}/${avatarIndex + 1}.png`;
    const avatar = `${BASE}images/flatmates/${gender}/${avatarIndex + 1}.png`;

    out.push({
      id: `${listing.id}-fm-${i + 1}`,
      name,
      about,
      verified: true,
      avatar,
      gender,
    });
  }
  return out;
}


// Build from current listings (keeps in sync if you add/remove listings)
const ALL_LISTINGS: Listing[] = [...popularMock, ...nearbyMock];

const counts = buildCounts(ALL_LISTINGS);

// Keyed by listingId
export const flatmatesByListing: Record<string, Flatmate[]> = ALL_LISTINGS.reduce(
  (acc, l) => {
    acc[l.id] = makeFlatmatesForListing(l, counts[l.id] ?? 0);
    return acc;
  },
  {} as Record<string, Flatmate[]>
);
