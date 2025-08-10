import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* Inline back arrow (no deps) */
function BackArrow({ className = "h-6 w-6 text-gray-700" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type ProviderKey = "oneroof" | "rentalstats" | "statsnz" | "wikipedia";

/* Build provider search URLs — keep robust using site: queries */
function providerSearchUrl(p: ProviderKey, suburb: string, region: string) {
  const q = encodeURIComponent(`${suburb} ${region}`.trim());
  switch (p) {
    case "oneroof":
      return `https://www.google.com/search?q=site:oneroof.co.nz+${q}+suburb+profile`;
    case "rentalstats":
      return `https://www.google.com/search?q=site:rentalstats.nz+${q}`;
    case "statsnz":
      return `https://www.google.com/search?q=site:data.stats.govt.nz+${q}+rental+crime+population`;
    case "wikipedia":
      return `https://www.google.com/search?q=${q}+suburb+Wikipedia`;
  }
}

const PROVIDER_HOME = {
  oneroof: "https://www.oneroof.co.nz",
  rentalstats: "https://rentalstats.nz",
  statsnz: "https://data.stats.govt.nz",
  wikipedia: "https://en.wikipedia.org/wiki/Urban_areas_of_New_Zealand",
};

/* Optional chips for fast region selection */
const REGIONS = [
  "Auckland",
  "Wellington",
  "Christchurch",
  "Hamilton",
  "Tauranga",
  "Dunedin",
  "Palmerston North",
];

export default function Suburbs() {
  const navigate = useNavigate();
  const [suburb, setSuburb] = useState("");
  const [region, setRegion] = useState("");

  const disabled = useMemo(() => suburb.trim().length === 0, [suburb]);

  const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div className="p-4">
      {/* Sticky: header + inputs */}
      <div className="sticky top-14 z-30 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex items-center gap-2 py-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 rounded hover:bg-gray-100 active:bg-gray-200"
            aria-label="Go back"
          >
            <BackArrow />
          </button>
          <h1 className="text-xl font-semibold">Suburb Profiles</h1>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-2 pb-2">
          <input
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            placeholder="Enter a suburb (e.g., Hillcrest)"
            className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Suburb"
          />
          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="City/Region (e.g., Hamilton)"
            className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Region"
          />
        </div>

        {/* Region chips (optional quick fill) */}
        <div className="pb-3 flex flex-wrap gap-1">
          {REGIONS.map((r) => (
            <button
              key={r}
              className={`text-xs px-2 py-1 rounded-full border hover:bg-gray-50 ${region === r ? "bg-gray-100" : ""}`}
              onClick={() => setRegion(r)}
              aria-label={`Use region ${r}`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Primary CTA + secondary providers */}
        <div className="pb-3 flex flex-wrap items-center gap-2">
          <button
            disabled={disabled}
            onClick={() => open(providerSearchUrl("oneroof", suburb, region))}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${disabled ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Search on OneRoof
          </button>

          <button
            disabled={disabled}
            onClick={() => open(providerSearchUrl("rentalstats", suburb, region))}
            className="px-3 py-2 rounded-lg text-sm border hover:bg-gray-50"
          >
            RentalStats
          </button>
          <button
            disabled={disabled}
            onClick={() => open(providerSearchUrl("statsnz", suburb, region))}
            className="px-3 py-2 rounded-lg text-sm border hover:bg-gray-50"
          >
            Stats NZ
          </button>
          <button
            disabled={disabled}
            onClick={() => open(providerSearchUrl("wikipedia", suburb, region))}
            className="px-3 py-2 rounded-lg text-sm border hover:bg-gray-50"
          >
            Wikipedia
          </button>
        </div>
      </div>

      {/* Helpful links / tiles */}
      <div className="space-y-6 pt-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <ProviderTile
            title="OneRoof — Find a Suburb"
            desc="Maps, price trends, local insights. Best general profile source."
            href={PROVIDER_HOME.oneroof}
          />
          <ProviderTile
            title="RentalStats NZ — Market Dashboard"
            desc="Current and historical rent data by area."
            href={PROVIDER_HOME.rentalstats}
          />
          <ProviderTile
            title="Stats NZ — Data Explorer"
            desc="Population, demographics, crime & more (varies by dataset)."
            href={PROVIDER_HOME.statsnz}
          />
          <ProviderTile
            title="Wikipedia — Suburb Lists"
            desc="Background reading and suburb listings by city."
            href={PROVIDER_HOME.wikipedia}
          />
        </div>

      </div>
    </div>
  );
}

function ProviderTile({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border p-4 hover:bg-gray-50"
    >
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </a>
  );
}
