import { useCallback, useEffect, useState } from "react";
import { PersonService } from "../../services/PersonService";
import type { Person } from "../../models/Person";

const personService = new PersonService();

export function useWorkerProfile() {
    const [profile, setProfile] = useState<Person | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        personService.findWorkerProfile().then((response) => {
            if (!active) return;

            if (!response.getEstado()) {
                setProfile(null);
                setError(
                    response.getMensaje() ||
                    "The employee profile could not be loaded."
                );
                setLoading(false);
                return;
            }

            const data = response.getResultado<Person>("registro");
            setProfile(data ?? null);
            setError(null);
            setLoading(false);
        });

        return () => {
            active = false;
        };
    }, []);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);

        const response = await personService.findWorkerProfile();

        if (!response.getEstado()) {
            setProfile(null);
            setError(
                response.getMensaje() ||
                "The employee profile could not be loaded."
            );
            setLoading(false);
            return;
        }

        const data = response.getResultado<Person>("registro");
        setProfile(data ?? null);
        setLoading(false);
    }, []);

    return {
        profile,
        loading,
        error,
        reload,
    };
}