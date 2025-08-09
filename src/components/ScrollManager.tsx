import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * On PUSH/REPLACE navigations, scroll to top.
 * On POP (back/forward), keep prior scroll position.
 */
export default function ScrollManager({
  behavior = 'auto', // 'auto' | 'smooth'
}: { behavior?: ScrollBehavior }) {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType === 'POP') return; // preserve on back/forward
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, navType, behavior]);

  return null;
}
