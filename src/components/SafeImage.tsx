import { useState } from 'react';
import { FiImage } from 'react-icons/fi';

type Props = {
  src?: string;
  alt: string;
  heightClass?: string;
  className?: string;
};

export default function SafeImage({
  src,
  alt,
  heightClass = 'h-40',
  className = '',
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // Always have a fallback to local placeholder
  const finalSrc = !src || failed ? '/placeholder.webp' : src;

  return (
    <div className={`relative w-full ${heightClass} ${className}`}>
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {!loaded && (
        <div className="absolute inset-0 grid place-items-center bg-slate-200 animate-pulse dark:bg-slate-800">
          <FiImage size={28} className="opacity-60" />
        </div>
      )}
    </div>
  );
}
