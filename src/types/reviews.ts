export type Review = {
    id: string;
    listingId: string;
    author: string;
    rating: number;      // 0..5 (0.5 steps)
    createdAt: string;   // ISO
    body: string;
    avatar?: string;
  };
  
  export type ReviewsPayload = {
    listingId: string;
    reviews: Review[];
  };
  