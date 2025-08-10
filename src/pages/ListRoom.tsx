import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../state/ListingsContext';
import SafeImage from '../components/SafeImage';

type UiType = 'Studio' | 'Single' | 'Double' | 'En suite';
const toListingType = (t: UiType) =>
  t === 'Studio' ? 'Studio' : t === 'Single' ? '1BR' : t === 'Double' ? '2BR' : 'Flatmate';

// Convert selected files to data URLs so they keep working after navigation
const filesToDataUrls = (files: File[]) =>
  Promise.all(
    files.map(
      (f) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(f);
        })
    )
  );

export default function ListRoom() {
  const navigate = useNavigate();
  const { addListing } = useListings();

  const [title, setTitle] = useState('');             // Property name
  const [location, setLocation] = useState('');
  const [uiType, setUiType] = useState<UiType>('Studio');
  const [rent, setRent] = useState<number | ''>('');
  const [available, setAvailable] = useState<string>('');
  const [desc, setDesc] = useState('');

  // photos
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  // local toast
  const [toast, setToast] = useState<string | null>(null);

  // Clean up object URLs created for previews (avoid memory leaks)
  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, [previews]);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...list].slice(0, 12)); // cap to 12 images
    e.currentTarget.value = ''; // allow re-selecting same files
  };

  const removeAt = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const canPublish = title.trim() && location.trim() && rent !== '' && files.length > 0;

  const onPublish = async () => {
    if (!canPublish) return;
    const dataUrls = await filesToDataUrls(files); // persistable images

    const id = addListing({
      title: title.trim() || `${uiType} room in ${location}`,
      subtitle: `${location}${available ? ` • Available ${new Date(available).toLocaleDateString()}` : ''}`,
      price: rent === '' ? undefined : `$${rent}/wk`,
      type: toListingType(uiType),
      loc: location,
      desc,
      images: dataUrls,          // store data URLs so Home / Details show them
      img: dataUrls[0] || null,  // thumbnail for cards
      rating: 0,
      reviews: 0,
      badge: 'New',
    });

    setToast('Room published!');
    setTimeout(() => navigate(`/listing/${id}`), 900); // short toast, then navigate
  };

  const Pill = ({ label }: { label: UiType }) => {
    const selected = uiType === label;
    return (
      <button
        type="button"
        onClick={() => setUiType(label)}
        className={`rounded-full border px-4 py-2 text-base transition ${
          selected
            ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-200 dark:bg-slate-200 dark:text-slate-900'
            : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
        aria-pressed={selected}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-3">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18 9 12l6-6" />
          </svg>
        </button>
        <h1 className="text-xl font-extrabold">ENTER ROOM DETAILS</h1>
      </div>

      {/* PROPERTY NAME */}
      <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
        PROPERTY NAME
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='e.g., "Cozy Nook"'
        className="mb-4 w-full border-b border-slate-300 bg-transparent px-1 py-2 outline-none focus:border-slate-900 dark:border-slate-700 dark:focus:border-slate-200"
      />

      {/* LOCATION */}
      <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
        LOCATION
      </label>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Hamilton Central"
          className="w-full border-b border-slate-300 bg-transparent px-1 py-2 outline-none focus:border-slate-900 dark:border-slate-700 dark:focus:border-slate-200"
        />
        <span className="text-slate-400">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z" />
            <circle cx="12" cy="11" r="2.5" />
          </svg>
        </span>
      </div>

      {/* ROOM TYPE */}
      <h2 className="mb-3 mt-4 text-lg font-semibold">ROOM TYPE</h2>
      <div className="mb-6 flex flex-wrap gap-3">
        {(['Studio', 'Single', 'Double', 'En suite'] as UiType[]).map((t) => (
          <Pill key={t} label={t} />
        ))}
      </div>

      {/* WEEKLY RENT */}
      <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
        WEEKLY RENT
      </label>
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-md border border-slate-300 px-2 py-2 text-slate-500 dark:border-slate-700">$</span>
        <input
          type="number"
          min={0}
          value={rent}
          onChange={(e) => setRent(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="e.g., 450"
          className="w-full border-b border-slate-300 bg-transparent px-1 py-2 outline-none focus:border-slate-900 dark:border-slate-700 dark:focus:border-slate-200"
        />
        <span className="text-sm text-slate-500 dark:text-slate-400">per week</span>
      </div>

      {/* AVAILABLE DATE */}
      <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
        AVAILABLE DATE
      </label>
      <input
        type="date"
        value={available}
        onChange={(e) => setAvailable(e.target.value)}
        className="mb-4 w-full border-b border-slate-300 bg-transparent px-1 py-2 outline-none focus:border-slate-900 dark:border-slate-700 dark:focus:border-slate-200"
      />

      {/* DESCRIPTION */}
      <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
        DESCRIPTION
      </label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={5}
        placeholder="Tell people about the room, flat vibe, and nearby perks…"
        className="mb-6 w-full resize-y rounded-xl border border-slate-300 bg-white/70 p-3 outline-none placeholder:text-slate-400 focus:border-slate-900 dark:border-slate-700 dark:bg-slate-900/40 dark:focus:border-slate-200"
      />

      {/* UPLOAD PHOTOS */}
      <div className="mb-4">
        <input id="photos" type="file" accept="image/*" multiple onChange={onUpload} className="hidden" />
        <label
          htmlFor="photos"
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-slate-300 px-6 text-sm font-semibold text-white hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          UPLOAD PHOTOS
        </label>
        <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">
          {files.length ? `${files.length} photo${files.length > 1 ? 's' : ''} selected` : 'Up to 12 images'}
        </span>
      </div>

      {/* Previews (removable) */}
      {previews.length > 0 && (
        <div className="mb-6 flex gap-3 overflow-x-auto pb-1">
          {previews.map((src, i) => (
            <div
              key={i}
              className="relative min-w-[160px] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800"
            >
              <SafeImage src={src} alt={`Photo ${i + 1}`} heightClass="h-32" />
              <button
                onClick={() => removeAt(i)}
                aria-label="Remove photo"
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Publish */}
      <button
        disabled={!canPublish}
        onClick={onPublish}
        className={`inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition ${
          canPublish
            ? 'bg-slate-900 text-white hover:bg-black active:scale-[0.99] dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white'
            : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500'
        }`}
      >
        PUBLISH ROOM
      </button>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-slate-200 dark:text-slate-900">
          {toast}
        </div>
      )}
    </div>
  );
}
