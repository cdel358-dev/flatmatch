import { Review } from '../types/reviews';

const now = Date.now();
const isoAgo = (days: number) => new Date(now - days * 24 * 3600e3).toISOString();

export const reviewsByListing: Record<string, Review[]> = {
  // popular
  p1: [
    { id: 'p1-r1', listingId: 'p1', author: 'Kay Cee', rating: 4.5, createdAt: isoAgo(3),  body: 'Great location and responsive host.' },
    { id: 'p1-r2', listingId: 'p1', author: 'Qiuxiao', rating: 5.0, createdAt: isoAgo(12), body: 'Spotless and quiet, would stay again.' },
    { id: 'p1-r3', listingId: 'p1', author: 'Kane',    rating: 3.5, createdAt: isoAgo(45), body: 'Good value but a bit small.' },
    { id: 'p1-r4', listingId: 'p1', author: 'Maria',   rating: 2.0, createdAt: isoAgo(5),  body: 'Could be cleaner.' },
    { id: 'p1-r5', listingId: 'p1', author: 'Liam',    rating: 4.0, createdAt: isoAgo(60), body: 'Comfortable with useful amenities.' },
  ],
  p3: [
    { id: 'p3-r1', listingId: 'p3', author: 'Jordan', rating: 4.5, createdAt: isoAgo(2),  body: 'Bright and spacious.' },
    { id: 'p3-r2', listingId: 'p3', author: 'Riley',  rating: 4.5, createdAt: isoAgo(9),  body: 'Parking was a big plus.' },
    { id: 'p3-r3', listingId: 'p3', author: 'Ari',    rating: 5.0, createdAt: isoAgo(30), body: 'Loved it!' },
  ],
  // nearby
  n1: [
    { id: 'n1-r1', listingId: 'n1', author: 'Taylor', rating: 4.0, createdAt: isoAgo(1),  body: 'Walkable to CBD.' },
    { id: 'n1-r2', listingId: 'n1', author: 'Sam',    rating: 3.5, createdAt: isoAgo(7),  body: 'A bit noisy on weekends.' },
  ],
  // others can be added as needed
};
