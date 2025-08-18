import React, { useState } from 'react';

const ROOM_TYPES = ['Studio', 'Single', 'Double', 'En suite'];
const PRICE_BUCKETS = ['< $200', '$200–$300', '$300–400', '> $400'];

export default function Preferences() {
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [locations, setLocations] = useState(['', '', '']);

  const toggleRoomType = (type: string) => {
    setSelectedRoomTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const togglePrice = (price: string) => {
    setSelectedPrice(prev => (prev === price ? null : price));
  };

  const handleLocationChange = (index: number, value: string) => {
    setLocations(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-lg font-semibold">Alerts / Preferences</h1>

      {/* Room Type */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold">ROOM TYPE</h2>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map(type => {
            const selected = selectedRoomTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleRoomType(type)}
                className={[
                  'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition',
                  selected
                    ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white'
                    : 'bg-[#E5E5E5] text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
                ].join(' ')}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold">PRICE</h2>
        <div className="flex flex-wrap gap-2">
          {PRICE_BUCKETS.map(price => {
            const selected = selectedPrice === price;
            return (
              <button
                key={price}
                onClick={() => togglePrice(price)}
                className={[
                  'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition',
                  selected
                    ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white'
                    : 'bg-[#E5E5E5] text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
                ].join(' ')}
              >
                {price}
              </button>
            );
          })}
        </div>
      </div>

      {/* Locations */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Add up to 3 locations
        </p>
        {locations.map((loc, i) => (
          <div
            key={i}
            className="flex items-center rounded border px-3 py-2 shadow-sm"
          >
            <input
              type="text"
              placeholder="Location"
              value={loc}
              onChange={e => handleLocationChange(i, e.target.value)}
              className="flex-1 border-none bg-transparent text-sm focus:outline-none"
            />
            <span className="ml-2 text-slate-400">📍</span>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        className="mt-4 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        disabled={!selectedRoomTypes.length && !selectedPrice && !locations.some(l => l)}
      >
        SET ALERT
      </button>
    </div>
  );
}
