import { useState, useEffect } from "react";

// const isMobile = useMediaQuery("(max-width: 768px)");

export function useMediaQuery(query) {
    const media = window.matchMedia(query);
    const [matches, setMatches] = useState(media.matches);

    useEffect(() => {
        const handler = e => setMatches(e.matches);
        media.addEventListener("change", handler);

        return () => media.removeEventListener("change", handler);
    }, [query]);

    return matches;
}