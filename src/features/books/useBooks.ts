// src/features/books/useBooks.ts
import { useCallback } from 'react';
import { searchBooks, type BookFilters } from '../../api/books';
import { useFetch } from '../../shared/hooks/useFetch';

export function useBooks(filters: BookFilters) {
    const fetcher = useCallback(
        (signal: AbortSignal) => searchBooks(filters, signal),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filters.search, filters.genre, filters.page, filters.sortBy],
    );
    
    return useFetch(fetcher, [filters.search, filters.genre, filters.page, filters.sortBy]);
}