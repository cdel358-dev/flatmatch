// src/pages/info/Etiquette.tsx
import { useNavigate, Link } from "react-router-dom";
import BackButton from "../../components/BackButton";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-sm text-gray-800 space-y-2">{children}</div>
    </section>
  );
}

export default function Etiquette() {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      {/* Sticky header */}
      <div className="sticky top-14 z-30 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex items-center gap-2 py-2">
          <BackButton
            className="p-1 -ml-1 rounded hover:bg-gray-100 active:bg-gray-200"
            iconClassName="h-6 w-6 text-gray-700"
            label="" // no text, just the arrow
          />
          <h1 className="text-xl font-semibold">Flatting Etiquette & Onboarding</h1>
        </div>

        {/* CTA to the separate checklist page */}
        <div className="pb-3">
          <Link
            to="/info/tenancy-checklist"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Open the NZ Tenancy Checklist
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 pt-3">
        <Section title="Key Rights & Responsibilities">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Tenants must:</strong> pay rent on time; keep the premises reasonably clean and tidy; notify the landlord of damage/repairs; pay utilities unless included; use the property mainly as a residence; leave it clean on exit.</li>
            <li><strong>Landlords must:</strong> provide a written tenancy agreement; ensure the property is habitable and meets Healthy Homes Standards; respect quiet enjoyment; lodge the bond with Tenancy Services within 23 working days.</li>
          </ul>
        </Section>

        <Section title="Tenants vs Flatmates">
          <p>
            If your name is on the tenancy agreement, you are a <strong>tenant</strong> protected by the Residential
            Tenancies Act 1986. If you rent a room from a tenant or homeowner, you’re likely a <strong>flatmate</strong> and not covered by tenancy law—use a flat‑sharing agreement to define expectations. Disputes between flatmates go to the <em>Disputes Tribunal</em>, not the Tenancy Tribunal.
          </p>
        </Section>

        <Section title="Onboarding Checklist for New Flatmates (Overview)">
          <ol className="list-decimal pl-5 space-y-1">
            <li>Sign agreements and make sure everyone understands the terms.</li>
            <li>Pay bond and rent in advance; confirm bond lodgement.</li>
            <li>Do a property inspection with photos and notes.</li>
            <li>Agree how utilities will be split and set them up.</li>
            <li>Establish house rules (cleaning, quiet hours, guests, shared costs).</li>
            <li>Share emergency contacts for flatmates, landlord, and local services.</li>
          </ol>
          <p className="text-sm text-gray-600">
            For a full, interactive checklist with progress tracking, use the{" "}
            <Link to="/info/tenancy-checklist" className="text-blue-600 underline">NZ Tenancy Checklist</Link>.
          </p>
        </Section>

        <Section title="Flatting Etiquette (NZ)">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4">
              <h3 className="font-medium mb-2">Communication</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Use house meetings or group chats to address issues early.</li>
                <li>Be honest and respectful—avoid passive‑aggressive notes.</li>
              </ul>
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="font-medium mb-2">Cleaning & Shared Spaces</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Follow a cleaning roster; don’t leave dishes overnight.</li>
                <li>Keep communal areas tidy—don’t monopolise or clutter them.</li>
              </ul>
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="font-medium mb-2">Guests & Noise</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Give a heads‑up for overnight guests; respect quiet hours.</li>
                <li>Use headphones for music, gaming, or late‑night calls.</li>
              </ul>
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="font-medium mb-2">Personal Items</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Ask before borrowing. Don’t use others’ food or toiletries without permission.</li>
              </ul>
            </div>

            <div className="rounded-xl border p-4 sm:col-span-2">
              <h3 className="font-medium mb-2">Romantic/Sexual Etiquette</h3>
              <p className="text-sm">
                Be mindful of intimacy in shared spaces—avoid noise or displays that could make others uncomfortable.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Departing the Flat">
          <ul className="list-disc pl-5 space-y-1">
            <li>Give written notice (fixed‑term needs agreement; periodic usually 28 days).</li>
            <li>Deep clean your room and shared areas; include fridge/oven if applicable.</li>
            <li>Do a final inspection with photos and return all keys.</li>
            <li>Settle outstanding bills and confirm bond refund details.</li>
          </ul>
        </Section>

        <Section title="Useful Links">
          <ul className="list-disc pl-5 space-y-1">
            <li><a className="text-blue-600 underline" href="https://www.tenancy.govt.nz/starting-a-tenancy/new-to-tenancy/key-rights-and-responsibilities/" target="_blank" rel="noreferrer">Tenancy Services: Rights & Responsibilities</a></li>
            <li><a className="text-blue-600 underline" href="https://www.tenancy.govt.nz/starting-a-tenancy/new-to-tenancy/information-for-new-tenants/" target="_blank" rel="noreferrer">Tenancy Services: Info for New Tenants</a></li>
            <li><a className="text-blue-600 underline" href="https://www.tenancy.govt.nz/starting-a-tennancy/flatting/" target="_blank" rel="noreferrer">Tenancy Services: Flatting & Sharing</a></li>
            <li><a className="text-blue-600 underline" href="https://www.1news.co.nz/2024/06/06/the-ins-and-outs-of-sex-etiquette-while-flatting/" target="_blank" rel="noreferrer">1News: Sex etiquette while flatting</a></li>
          </ul>
        </Section>

        <p className="text-xs text-gray-500">
          This page is a quick‑read guide. For step‑by‑step actions, open the checklist above.
        </p>
      </div>
    </div>
  );
}
