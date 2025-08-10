// src/pages/info/TenancyChecklist.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import checklistPdf from "../../data/tenancy-checklist.pdf";

/* Back arrow (inline SVG, no deps) */
function BackArrow({ className = "h-6 w-6 text-gray-700" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Data ---------- */
type Item = { id: string; label: string };
type CheckState = Record<string, boolean>;

const BEFORE_MOVE_IN: Item[] = [
  { id: "sign-agreement", label: "Sign a written tenancy or flatmate agreement (keep a copy)." },
  { id: "bond-rent", label: "Pay bond and rent in advance; get receipts." },
  { id: "bond-lodged", label: "Confirm the bond will be lodged with Tenancy Services (within 23 working days)." },
  { id: "chattels-list", label: "Request a chattels list (furniture/appliances/curtains)." },
  { id: "entry-inspection", label: "Do an entry inspection; take date‑stamped photos of existing damage." },
  { id: "healthy-homes", label: "Ask for Healthy Homes Statement/compliance details." },
  { id: "utilities-setup", label: "Set up utilities (power, internet, gas, water) and agree how to split bills." },
  { id: "waste-rules", label: "Learn rubbish & recycling rules and collection days." },
  { id: "keys-access", label: "Collect all keys/access (front/back, mailbox, storage)." },
  { id: "renters-insurance", label: "Consider renters’/contents insurance." },
];

const DURING_TENANCY: Item[] = [
  { id: "rent-on-time", label: "Pay rent on time (set up automatic payment)." },
  { id: "keep-tidy", label: "Keep the flat reasonably clean and tidy; follow cleaning roster." },
  { id: "report-issues", label: "Report repairs/issues to landlord quickly (document in writing)." },
  { id: "respect-flatmates", label: "Respect flatmates—noise down, share spaces fairly, communicate early." },
  { id: "review-receipts", label: "Review rent statements/receipts regularly." },
  { id: "ask-before-adding", label: "Ask before bringing long‑term guests or new flatmates." },
  { id: "note-inspections", label: "Note inspections/rent increases (proper notice must be given)." },
  { id: "house-meetings", label: "Use house meetings/group chat to resolve issues early." },
];

const WHEN_MOVING_OUT: Item[] = [
  { id: "give-notice", label: "Give written notice (fixed‑term needs agreement; periodic usually 28 days)." },
  { id: "deep-clean", label: "Deep clean room and common areas (incl. fridge/oven if applicable)." },
  { id: "final-inspection", label: "Do a final inspection with landlord; take photos." },
  { id: "return-keys", label: "Return all keys and access devices." },
  { id: "settle-bills", label: "Settle all outstanding bills and flat expenses." },
  { id: "bond-refund", label: "Complete bond refund form and confirm details." },
  { id: "remove-belongings", label: "Remove all belongings—don’t leave furniture or rubbish." },
];

/* ---------- Checklist component ---------- */
function Checklist({
  group,
  items,
  value,
  onToggle,
}: {
  group: "before" | "during" | "moving";
  items: Item[];
  value: CheckState;
  onToggle: (group: "before" | "during" | "moving", id: string) => void;
}) {
  return (
    <ul className="divide-y rounded-xl border overflow-hidden">
      {items.map((it) => (
        <li key={it.id} className="flex items-start gap-3 p-3">
          <input
            id={`${group}-${it.id}`}
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300"
            checked={!!value[it.id]}
            onChange={() => onToggle(group, it.id)}
          />
          <label htmlFor={`${group}-${it.id}`} className="text-sm text-gray-800 cursor-pointer">
            {it.label}
          </label>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Page ---------- */
export default function TenancyChecklist() {
  const navigate = useNavigate();
  const STORAGE_KEY = "info.tenancy-checklist.v1";

  const [checks, setChecks] = useState<Record<string, CheckState>>({
    before: {},
    during: {},
    moving: {},
  });

  // Load saved state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecks((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
    } catch {}
  }, [checks]);

  const toggle = (group: "before" | "during" | "moving", id: string) =>
    setChecks((prev) => ({ ...prev, [group]: { ...prev[group], [id]: !prev[group][id] } }));

  const resetAll = () => setChecks({ before: {}, during: {}, moving: {} });

  const completedCount = useMemo(() => {
    const all = [...Object.values(checks.before), ...Object.values(checks.during), ...Object.values(checks.moving)];
    return all.filter(Boolean).length;
  }, [checks]);

  return (
    <div className="p-4">
      {/* Sticky header */}
      <div className="sticky top-14 z-30 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex items-center gap-2 py-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 rounded hover:bg-gray-100 active:bg-gray-200"
            aria-label="Go back"
          >
            <BackArrow />
          </button>
          <h1 className="text-xl font-semibold">NZ Tenancy Checklist</h1>
        </div>

        <div className="flex items-center justify-between pb-2">
          <p className="text-xs text-gray-600">
            Checklist progress: <span className="font-medium">{completedCount}</span> completed
          </p>
          <div className="flex items-center gap-2">
            <a
              href={checklistPdf}
              download="NZ-Tenancy-Checklist.pdf"
              className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
              aria-label="Download NZ Tenancy Checklist PDF"
            >
              Download PDF
            </a>
            <button
              onClick={resetAll}
              className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
              aria-label="Reset all checklist ticks"
            >
              Reset ticks
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 pt-3">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Before Moving In</h2>
          <Checklist group="before" items={BEFORE_MOVE_IN} value={checks.before} onToggle={toggle} />
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">During Tenancy</h2>
          <Checklist group="during" items={DURING_TENANCY} value={checks.during} onToggle={toggle} />
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">When Moving Out</h2>
          <Checklist group="moving" items={WHEN_MOVING_OUT} value={checks.moving} onToggle={toggle} />
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Useful Links</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              <a className="text-blue-600 underline" href="https://www.tenancy.govt.nz/starting-a-tenancy/new-to-tenancy/key-rights-and-responsibilities/" target="_blank" rel="noreferrer">
                Tenancy Services: Rights & Responsibilities
              </a>
            </li>
            <li>
              <a className="text-blue-600 underline" href="https://www.tenancy.govt.nz/starting-a-tenancy/new-to-tenancy/information-for-new-tenants/" target="_blank" rel="noreferrer">
                Tenancy Services: Info for New Tenants
              </a>
            </li>
            <li>
              <a className="text-blue-600 underline" href="https://www.tenancy.govt.nz/starting-a-tenancy/flatting/" target="_blank" rel="noreferrer">
                Tenancy Services: Flatting & Sharing
              </a>
            </li>
          </ul>
          <p className="text-xs text-gray-500">Your ticks are saved on this device only.</p>
        </section>
      </div>
    </div>
  );
}
