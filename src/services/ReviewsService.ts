import { ReviewsPayload } from '../types/reviews';
import { reviewsByListing } from '../data/mockReviews';

export interface ReviewsService {
  fetchByListingId(listingId: string): Promise<ReviewsPayload>;
}

export class MockReviewsService implements ReviewsService {
  async fetchByListingId(listingId: string): Promise<ReviewsPayload> {
    // Simulate latency if you like:
    // await new Promise(r => setTimeout(r, 150));
    return { listingId, reviews: (reviewsByListing[listingId] ?? []).slice() };
  }
}

export class HttpReviewsService implements ReviewsService {
  constructor(private baseUrl = '/api') {}
  async fetchByListingId(listingId: string): Promise<ReviewsPayload> {
    const res = await fetch(`${this.baseUrl}/listings/${listingId}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return (await res.json()) as ReviewsPayload; // { listingId, reviews: [...] }
  }
}
