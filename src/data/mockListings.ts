// Central place for demo data you can edit freely.
// Replace with your real backend data shape later.

import type { Listing } from '../state/ListingsContext';

export const popularMock: Listing[] = [
  { id: 'p1', title: 'Sunny 1BR near CBD', subtitle: 'Hamilton Central', price: '$420/wk', badge: 'Popular', type: '1BR', loc: 'Hamilton', km: 1.0, saved: true, rating: 4.6, reviews: 152 },
  { id: 'p2', title: 'Modern studio',       subtitle: 'Hillcrest',         price: '$350/wk', type: 'Studio',  loc: 'Hillcrest', km: 2.2, rating: 4.2, reviews: 88 },
  { id: 'p3', title: '2BR with parking',    subtitle: 'Rototuna',          price: '$520/wk', type: '2BR',     loc: 'Rototuna', km: 4.5, saved: true, rating: 4.8, reviews: 231 },
  { id: 'p4', title: 'Flatmate wanted',     subtitle: 'Frankton',          price: '$210/wk', type: 'Flatmate',loc: 'Frankton', km: 3.6, rating: 3.9, reviews: 47 },
];

export const nearbyMock: Listing[] = [
  { id: 'n1', title: 'City studio',  subtitle: '0.5 km • CBD',        price: '$380/wk', badge: 'Nearby', type: 'Studio',  loc: 'CBD',         km: 0.5, rating: 4.3, reviews: 61 },
  { id: 'n2', title: 'Cozy 1BR',     subtitle: '1.2 km • River Rd',   price: '$410/wk',                 type: '1BR',     loc: 'River Rd',    km: 1.2, rating: 4.5, reviews: 104 },
  { id: 'n3', title: 'Shared room',  subtitle: '1.9 km • Five Cross', price: '$180/wk',                 type: 'Flatmate',loc: 'Five Cross',  km: 1.9, rating: 3.7, reviews: 23 },
  { id: 'n4', title: 'Large 2BR',    subtitle: '2.4 km • Claudelands',price: '$540/wk',                 type: '2BR',     loc: 'Claudelands', km: 2.4, rating: 4.9, reviews: 312 },
];
