import { useState, useEffect } from "react";

/**
 * 
 * Sustituye por TanStack Query para cache y sincronizacion avanzada
 * 
 */

// const { data, loading, error } = useFetch("/api/users");

export function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;

        fetch(url)
            .then(r => r.json())
            .then(json => active && setData(json))
            .catch(err => active && setError(err))
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, [url]);

    return { data, loading, error };
}