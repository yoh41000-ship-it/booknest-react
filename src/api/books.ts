// src/api/books.ts
import { apiRequest } from './api-client';
import type { SearchResponse, SearchResult, Book } from '../types';

const PAGE_SIZE = 20;

export interface BookFilters {
    search: string;
    genre: string;
    page: number;
    sortBy?: 'title' | 'year' | 'rating';
}

export async function searchBooks(
    filters: BookFilters,
    signal?: AbortSignal,
): Promise<SearchResult> {
    const data = await apiRequest<SearchResponse>('/search.json', {
        params: {
            q: filters.search,
            page: filters.page,
            limit: PAGE_SIZE,
        },
        signal,
    });

    return {
        items: data.docs ?? [],
        total: data.numFound ?? 0,
        page: filters.page,
        pageSize: PAGE_SIZE,
        totalPages: Math.max(1, Math.ceil((data.numFound ?? 0) / PAGE_SIZE)),
    };
}

export async function getBook(id: string, signal?: AbortSignal): Promise<Book> {
    const cleanId = id.startsWith('/') ? id : `/works/${id}`;
    return apiRequest<Book>(`${cleanId}.json`, { signal });
}

export async function createBook(data: unknown): Promise<Book> {
    return apiRequest<Book>('/books', { method: 'POST', body: data });
}

export async function updateBook(id: string, data: unknown): Promise<Book> {
    return apiRequest<Book>(`/books/${id}`, { method: 'PUT', body: data });
}

export function getCoverUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'M'): string | null {
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}