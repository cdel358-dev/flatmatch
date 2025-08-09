import { HttpListingsService, MockListingsService, type ListingsService } from './ListingsService';

// Control with env var: VITE_USE_MOCK=true (default to mock if missing)
const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

export const listingsService: ListingsService = useMock
  ? new MockListingsService()
  : new HttpListingsService(import.meta.env.VITE_API_BASE_URL || '/api');
