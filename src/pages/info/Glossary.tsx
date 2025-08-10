import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import glossaryData from "../../data/glossary.json";

function BackArrow({ className = "h-6 w-6 text-gray-700" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type Term = { term: string; def: string };

function normalize(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/\p{Diacritic}/gu, "");
}

export default function Glossary() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    return glossaryData.filter(t => normalize(t.term).includes(q) || normalize(t.def).includes(q));
  }, [query]);

  const groups = useMemo(() => {
    const m = new Map<string, Term[]>();
    filtered.forEach(t => {
      const letter = t.term[0].toUpperCase();
      if (!m.has(letter)) m.set(letter, []);
      m.get(letter)!.push(t);
    });
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const letters = useMemo(() => groups.map(([l]) => l), [groups]);

  return (
    <div className="p-4">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex items-center gap-2 py-2">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded hover:bg-gray-100 active:bg-gray-200">
            <BackArrow />
          </button>
          <h1 className="text-xl font-semibold">Glossary of Flatting Terms</h1>
        </div>
        <div className="pb-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {letters.length > 0 && (
          <div className="pb-3 flex flex-wrap gap-1">
            {letters.map((l) => (
              <button
                key={l}
                className="text-xs px-2 py-1 rounded-full border hover:bg-gray-50"
                onClick={() => sectionRefs.current[l]?.scrollIntoView({ behavior: "smooth", block: "start" })}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Glossary content */}
      <div className="space-y-6 pt-3">
        {groups.map(([letter, items]) => (
          <div key={letter}>
            <div ref={(el) => (sectionRefs.current[letter] = el)} className="py-1">
              <h2 className="text-sm font-semibold text-gray-600">{letter}</h2>
            </div>
            <ul className="divide-y rounded-xl border overflow-hidden">
              {items.map((t) => (
                <li key={t.term} className="p-4">
                  <div className="font-medium">{t.term}</div>
                  <p className="text-sm text-gray-600 mt-1">{t.def}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="text-sm text-gray-500">No results for “{query}”.</div>
        )}
      </div>
    </div>
  );
}
