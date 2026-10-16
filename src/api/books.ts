// src/api/books.ts

import { apiGet } from '../lib/api-client';
import type { SearchResponse, SearchResult, Book } from '../types';

const PAGE_SIZE = 20;

export async function searchBooks(
    query: string,
    page = 1,
    signal?: AbortSignal,
): Promise<SearchResult> {
    const data = await apiGet<SearchResponse>('/search.json', {
        q: query,
        page,
        limit: PAGE_SIZE,
    }, signal);

    return {
        items: data.docs ?? [],
        total: data.numFound ?? 0,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil((data.numFound ?? 0) / PAGE_SIZE),
    };
}

export async function getBookById(id: string, signal?: AbortSignal): Promise<Book> {
    const cleanId = id.startsWith('/') ? id : `/works/${id}`;
    return apiGet<Book>(`${cleanId}.json`, {}, signal);
}

export function getCoverUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'M'): string | null {
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}