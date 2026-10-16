// src/types.ts
// Типы предметной области

export interface Book {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
    ratings_average?: number;
}

export interface SearchResponse {
    numFound: number;
    docs: Book[];
}

export interface SearchResult {
    items: Book[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export type SortBy = 'title' | 'year' | 'rating';

export type UiStateName = 'loading' | 'success' | 'empty' | 'error';

export interface UiState {
    name: UiStateName;
    message?: string;
}

export interface ApiErrorLike {
    status: number;
    message: string;
}