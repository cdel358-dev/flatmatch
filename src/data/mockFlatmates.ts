// src/data/mockFlatmates.ts
export type Flatmate = {
    id: string;
    name: string;
    verified?: boolean;
    avatar?: string;
    about?: string;
  };
  
  const fm = (id: string, name: string, about?: string, verified = true, avatar?: string): Flatmate => ({
    id, name, about, verified, avatar,
  });
  
  // Keyed by listingId
  export const flatmatesByListing: Record<string, Flatmate[]> = {
    // popular
    p1: [
      fm('f1', 'Alex',  'Software engineer. Early riser. Loves cycling.'),
      fm('f2', 'Sam',   'Nurse working nights. Bakes on weekends.'),
      fm('f3', 'Riley', 'PhD student. Into indoor plants & pottery.'),
    ],
    p3: [
      fm('f1', 'Jordan', 'Designer. Climbs on weekends.'),
      fm('f2', 'Ari',    'Barista. Cat person.'),
    ],
  
    // nearby
    n1: [
      fm('f1', 'Taylor', 'Retail. Morning shifts.', true),
      fm('f2', 'Morgan', 'Musician. Quiet after 9pm.', true),
    ],
    n3: [
      fm('f1', 'Casey',  'Hospitality. Works late.', true),
    ],
  };
  