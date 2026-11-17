// src/shared/hooks/useFetch.ts
import { useEffect, useState, type DependencyList } from 'react';

export interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useFetch<T>(
    fetcher: (signal: AbortSignal) => Promise<T>,
    deps: DependencyList,
): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let cancelled = false;
        
        setLoading(true);
        setError(null);

        fetcher(controller.signal)
            .then((result) => { 
                if (!cancelled) setData(result); 
            })
            .catch((e: unknown) => {
                if (cancelled) return;
                if (e instanceof Error && e.name === 'AbortError') return; // Игнорируем отмену
                setError(e instanceof Error ? e : new Error('Unknown error'));
            })
            .finally(() => { 
                if (!cancelled) setLoading(false); 
            });

        return () => {
            cancelled = true;
            controller.abort();  // ОЧИСТКА: отменяем запрос при размонтировании или смене deps
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, tick]);

    return { data, loading, error, refetch: () => setTick((t) => t + 1) };
}