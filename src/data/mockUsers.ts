// src/data/mockUsers.ts
export type User = {
    id: string;
    name: string;
    verified?: boolean;
    avatar?: string;
    about?: string;
    location?: string;
    joined?: string;        // ISO
    occupation?: string;
    schedule?: 'Early riser' | 'Night owl' | 'Mixed';
    pets?: 'None' | 'Cat' | 'Dog' | 'Cat & Dog' | 'Other';
    languages?: string[];
    interests?: string[];
  };
  
  export const usersById: Record<string, User> = {
    u1: {
      id: 'u1',
      name: 'John Doe',
      verified: true,
      about: 'Friendly, tidy, and loves a good flat dinner. Weekends = hiking or board games.',
      location: 'Hamilton, NZ',
      joined: '2023-09-02',
      occupation: 'Software Engineer',
      schedule: 'Early riser',
      pets: 'None',
      languages: ['English', 'Mandarin'],
      interests: ['Cycling', 'Coffee', 'Hiking', 'Photography'],
    },
    // add more as needed...
  };
  