"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

interface WatchlistContextValue {
    favorites: string[];
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => void;
    clearFavorites: () => void;
}

const STORAGE_KEY = "watchlist-favorites";

const WatchlistContext =
    createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [favorites, setFavorites] = useState<string[]>([]);

    /* ---------------- LOAD ---------------- */

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch {
            setFavorites([]);
        }
    }, []);

    /* ---------------- SAVE ---------------- */

    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(favorites)
        );
    }, [favorites]);

    /* ---------------- ACTIONS ---------------- */

    function toggleFavorite(id: string) {
        setFavorites(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    }

    function isFavorite(id: string) {
        return favorites.includes(id);
    }

    function clearFavorites() {
        setFavorites([]);
    }

    const value = useMemo(
        () => ({
            favorites,
            isFavorite,
            toggleFavorite,
            clearFavorites
        }),
        [favorites]
    );

    return (
        <WatchlistContext.Provider value={value}>
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const context = useContext(WatchlistContext);

    if (!context) {
        throw new Error(
            "useWatchlist must be used inside WatchlistProvider"
        );
    }

    return context;
}