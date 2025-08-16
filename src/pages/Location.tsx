// src/pages/Location.tsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useListings } from "../state/ListingsContext";
import { getMapAddress } from "../data/mockListings";

/** Fixed origin: University of Auckland Business School (12 Grafton Rd) */
const ORIGIN_NAME = "University of Auckland Business School";
const ORIGIN_ADDRESS = "Sir Owen G Glenn Building, 12 Grafton Road, Auckland Central, Auckland 1010";


export default function LocationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getListingById } = useListings();

    const listing = useMemo(() => (id ? getListingById(id).listing : undefined), [id, getListingById]);
    const title = listing?.propertyName || listing?.title || "Listing";
    const suburb = listing?.location || "";
    // const destQuery = encodeURIComponent(`${title} ${suburb} New Zealand`.trim());

    // Two pins via Google Maps "directions" embed (no API key).
    //   const mapsEmbed = `https://www.google.com/maps?output=embed&saddr=${ORIGIN_LAT},${ORIGIN_LNG}&daddr=${destQuery}`;
    //   const mapsExternal = `https://www.google.com/maps/dir/?api=1&origin=${ORIGIN_LAT},${ORIGIN_LNG}&destination=${destQuery}`;

    // const mapsEmbed = `https://www.google.com/maps?output=embed&saddr=${encodeURIComponent(ORIGIN_ADDRESS)}&daddr=${destQuery}`;
    // const mapsExternal = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(ORIGIN_ADDRESS)}&destination=${destQuery}`;

    const destQuery = encodeURIComponent(getMapAddress(listing!));
    const mapsEmbed = `https://www.google.com/maps?output=embed&saddr=${encodeURIComponent(ORIGIN_ADDRESS)}&daddr=${destQuery}`;
    const mapsExternal = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(ORIGIN_ADDRESS)}&destination=${destQuery}`;


    return (
        // <div className="p-4">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-3 text-slate-900 dark:text-slate-100">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <BackButton
                    className="p-1 -ml-1 rounded hover:bg-gray-100 active:bg-gray-200"
                    iconClassName="h-6 w-6 text-gray-700"
                    label="" // no text, just the arrow
                />
                <h1 className="text-xl font-semibold">Location</h1>
            </div>

            {/* Summary */}
            <div className="mx-auto max-w-3xl pt-3">
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="mt-1 flex items-start gap-3 text-slate-700">
                    <svg className="mt-0.5 h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 21s-6-4.35-6-9a6 6 0 1 1 12 0c0 4.65-6 9-6 9Z" />
                    </svg>
                    <div>
                        <div className="font-medium">{suburb}</div>
                        <div className="text-sm text-slate-500">From {ORIGIN_NAME}</div>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="mx-auto mt-3 max-w-5xl overflow-hidden rounded-xl border border-slate-200">
                <iframe
                    title="Map with directions"
                    src={mapsEmbed}
                    className="h-[70vh] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

            <div className="mx-auto max-w-3xl py-4 text-right">
                <a href={mapsExternal} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                    Open in Google Maps
                </a>
            </div>
        </div>
    );
}
