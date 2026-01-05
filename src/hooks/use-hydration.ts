
'use client';

import { useState, useEffect } from 'react';

/**
 * A custom hook to determine if the component has been hydrated on the client.
 * This is useful to prevent hydration mismatch errors when rendering content
 * that is only available or different on the client (e.g., components relying
 * on `window`, `localStorage`, or client-side-only hooks like `usePathname`).
 *
 * @returns {boolean} `true` if the component is hydrated, `false` otherwise.
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial server render.
    // Setting the state to true triggers a re-render, but since it's after
    // hydration, it won't cause a mismatch error.
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
