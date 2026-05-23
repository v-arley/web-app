import { useCallback, useEffect, useState } from "react";
import { AchievementService } from "../services/AchievementService";
import { UserPointService } from "../services/UserPointService";
import type { UserPoint } from "../models/UserPoint";
import type { AchievementPage } from "../models/Achievement";

const achievementService = new AchievementService();
const userPointService = new UserPointService();

export function useWorkerAchievements() {
    const [points, setPoints] = useState<UserPoint | null>(null);
    const [unlocked, setUnlocked] = useState<AchievementPage | null>(null);
    const [pending, setPending] = useState<AchievementPage | null>(null);

    const [unlockedPage, setUnlockedPage] = useState(1);
    const [pendingPage, setPendingPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        const [pointsRes, unlockedRes, pendingRes] = await Promise.all([
            userPointService.findWorkerPoints(),
            achievementService.findWorkerUnlocked(unlockedPage, 3),
            achievementService.findWorkerPending(pendingPage, 3),
        ]);

        if (!pointsRes.getEstado()) {
            setError(pointsRes.getMensaje());
        } else {
            setPoints(pointsRes.getResultado<UserPoint>("registro"));
        }

        if (!unlockedRes.getEstado()) {
            setError(unlockedRes.getMensaje());
        } else {
            setUnlocked(unlockedRes.getResultado<AchievementPage>("registro"));
        }

        if (!pendingRes.getEstado()) {
            setError(pendingRes.getMensaje());
        } else {
            setPending(pendingRes.getResultado<AchievementPage>("registro"));
        }
    }, [unlockedPage, pendingPage]);

    useEffect(() => {
        let active = true;

        async function loadInitialData() {
            try {
                const [pointsRes, unlockedRes, pendingRes] = await Promise.all([
                    userPointService.findWorkerPoints(),
                    achievementService.findWorkerUnlocked(unlockedPage, 3),
                    achievementService.findWorkerPending(pendingPage, 3),
                ]);

                if (!active) return;

                if (!pointsRes.getEstado()) {
                    setError(pointsRes.getMensaje());
                } else {
                    setPoints(pointsRes.getResultado<UserPoint>("registro"));
                }

                if (!unlockedRes.getEstado()) {
                    setError(unlockedRes.getMensaje());
                } else {
                    setUnlocked(unlockedRes.getResultado<AchievementPage>("registro"));
                }

                if (!pendingRes.getEstado()) {
                    setError(pendingRes.getMensaje());
                } else {
                    setPending(pendingRes.getResultado<AchievementPage>("registro"));
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        void loadInitialData();

        return () => {
            active = false;
        };
    }, [unlockedPage, pendingPage]);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);

        await fetchData();

        setLoading(false);
    }, [fetchData]);

    return {
        points,
        unlocked,
        pending,
        unlockedPage,
        pendingPage,
        setUnlockedPage,
        setPendingPage,
        loading,
        error,
        reload,
    };
}