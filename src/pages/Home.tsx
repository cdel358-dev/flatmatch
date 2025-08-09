import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="space-y-6">
      {/* Title (only mobile) */}
      <div className="block md:hidden">
        <h1 className="text-2xl font-bold">Flat Match.</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Find your perfect flat.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-slate-300 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
      </div>

      {/* Categories */}
      <section>
        <h2 className="font-semibold mb-3">Categories</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {['House', 'Studio', 'Apartment', 'Flat', 'Shared'].map((cat) => (
            <div
              key={cat}
              className="min-w-[120px] bg-slate-200 rounded-xl h-28 flex items-end justify-center pb-2 font-medium text-white flex-shrink-0"
              style={{ backgroundColor: '#333' }}
            >
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* Popular Listings */}
      <section>
        <h2 className="font-semibold mb-3">Popular</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {[{ title: 'Studious Studio', loc: 'Newmarket, Auckland' },
            { title: 'Lofty Loft', loc: 'Newmarket, Auckland' },
            { title: 'Sunny Apartment', loc: 'Ponsonby, Auckland' }].map((item) => (
            <div
              key={item.title}
              className="min-w-[260px] bg-slate-200 rounded-xl p-4 flex-shrink-0"
            >
              <div className="h-40 bg-slate-400 rounded-lg mb-3"></div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-slate-500">📍 {item.loc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Listings */}
      <section>
        <h2 className="font-semibold mb-3">Nearby</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {[{ title: 'Cozy Corner', loc: 'Epsom, Auckland' },
            { title: 'City Center Studio', loc: 'Auckland CBD' },
            { title: 'Waterfront Loft', loc: 'Viaduct, Auckland' }].map((item) => (
            <div
              key={item.title}
              className="min-w-[260px] bg-slate-200 rounded-xl p-4 flex-shrink-0"
            >
              <div className="h-40 bg-slate-400 rounded-lg mb-3"></div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-slate-500">📍 {item.loc}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
