// A tiny service interface + two impls (mock + HTTP).
// Swap between them with VITE_USE_MOCK=true/false

import type { Listing } from '../state/ListingsContext';
import { popularMock, nearbyMock } from '../data/mockListings';

export type ListingsPayload = { popular: Listing[]; nearby: Listing[] };

export interface ListingsService {
  fetchAll(): Promise<ListingsPayload>;
  // Add other endpoints later:
  // fetchById(id: string): Promise<Listing>;
  // search(params: ...): Promise<Listing[]>;
}

export class MockListingsService implements ListingsService {
  async fetchAll(): Promise<ListingsPayload> {
    // Simulate network latency if you want:
    // await new Promise(r => setTimeout(r, 200));
    return { popular: structuredClone(popularMock), nearby: structuredClone(nearbyMock) };
  }
}

export class HttpListingsService implements ListingsService {
  constructor(private baseUrl = '/api') {}
  async fetchAll(): Promise<ListingsPayload> {
    // Adjust to your backend shape. Example:
    const res = await fetch(`${this.baseUrl}/listings`);
    if (!res.ok) throw new Error('Failed to fetch listings');
    // Expecting { popular: Listing[], nearby: Listing[] }
    return (await res.json()) as ListingsPayload;
  }
}
