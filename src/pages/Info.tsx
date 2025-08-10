// src/pages/Info.tsx
import { useNavigate } from 'react-router-dom';

function BackArrow({ className = 'h-6 w-6 text-gray-700' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function Info() {
  const navigate = useNavigate();
  const infoPages = [
    { slug: 'glossary', title: 'Glossary of Flatting Terms', description: 'Learn common flatting terms and meanings.' },
    { slug: 'etiquette', title: 'Flatting Etiquette Tips', description: 'Tips to help you get along with flatmates.' },
    { slug: 'suburbs', title: 'Suburb Profiles', description: 'Explore different suburbs before you move.' },
    { slug: 'tenancy-checklist', title: 'NZ Tenancy Checklist', description: 'Everything you need to know before signing.' },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded hover:bg-gray-100 active:bg-gray-200">
          <BackArrow />
        </button>
        <h1 className="text-xl font-semibold">Flatting Info Pages</h1>
      </div>

      <div className="space-y-3">
        {infoPages.map(p => (
          <div
            key={p.slug}
            className="bg-white border rounded-xl p-4 shadow-sm hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/info/${p.slug}`)}
          >
            <h2 className="text-base font-medium">{p.title}</h2>
            <p className="text-sm text-gray-500">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
