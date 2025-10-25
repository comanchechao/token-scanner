import { useState, useEffect } from "react";

/**
 * A custom hook to determine if a media query matches.
 * @param query The media query string (e.g., '(max-width: 767px)').
 * @returns `true` if the query matches, `false` otherwise.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    return typeof window !== "undefined" ? window.matchMedia(query).matches : false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}