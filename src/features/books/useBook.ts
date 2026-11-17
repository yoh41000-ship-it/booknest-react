// src/features/books/useBook.ts
import { useCallback } from 'react';
import { getBook } from '../../api/books';
import { useFetch } from '../../shared/hooks/useFetch';

export function useBook(id: string | undefined) {
    const fetcher = useCallback(
        (signal: AbortSignal) => {
            if (!id) return Promise.reject(new Error('No id'));
            return getBook(id, signal);
        },
        [id],
    );
    return useFetch(fetcher, [id]);
}