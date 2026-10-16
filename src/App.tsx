// src/App.tsx

import { useEffect, useState, useCallback, useMemo, } from 'react';
import { searchBooks } from './api/books';
import { ApiError } from './lib/api-client';
import { FiltersPanel } from './components/FiltersPanel';
import { BookList } from './components/BookList';
import { Pagination } from './components/Pagination';
import { Wishlist } from './components/Wishlist';
import { Spinner } from './components/Spinner';
import { EmptyState } from './components/EmptyState';
import { ErrorBox } from './components/ErrorBox';
import { Badge } from './components/Badge';
import type { Book, SearchResult, SortBy, UiState } from './types';

const STORAGE_WISHLIST = 'booknest.wishlist.v3';
const STORAGE_WISHLIST_DETAILS = 'booknest.wishlist.v3.details';

function loadWishlistFromStorage(): Set<string> {
    try {
        const raw = localStorage.getItem(STORAGE_WISHLIST);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
}

function loadWishlistDetailsFromStorage(): Map<string, Book> {
    try {
        const raw = localStorage.getItem(STORAGE_WISHLIST_DETAILS);
        if (!raw) return new Map();
        const arr: Book[] = JSON.parse(raw);
        return new Map(arr.map((b) => [b.key, b]));
    } catch {
        return new Map();
    }
}

export default function App() {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortBy>('title');
    const [page, setPage] = useState(1);
    const [data, setData] = useState<SearchResult | null>(null);
    const [uiState, setUiState] = useState<UiState>({ name: 'empty' });
    const [wishlist, setWishlist] = useState<Set<string>>(loadWishlistFromStorage);
    const [wishlistDetails, setWishlistDetails] = useState<Map<string, Book>>(loadWishlistDetailsFromStorage);

    // Debounce через useEffect (правильный паттерн)
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedQuery(query);
        }, 350);
        return () => clearTimeout(timerId);
    }, [query]);

    // Сохранение wishlist
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_WISHLIST, JSON.stringify([...wishlist]));
            localStorage.setItem(
                STORAGE_WISHLIST_DETAILS,
                JSON.stringify([...wishlistDetails.values()]),
            );
        } catch (e) {
            console.warn('wishlist save failed', e);
        }
    }, [wishlist, wishlistDetails]);

    // Загрузка книг (без setState напрямую в effect — только в async обработчике)
    useEffect(() => {
        if (debouncedQuery.length < 2) {
            return undefined;
        }
        const controller = new AbortController();

        (async () => {
            setUiState({ name: 'loading' });
            setData(null);
            try {
                const result = await searchBooks(debouncedQuery, page, controller.signal);
                if (controller.signal.aborted) return;
                setData(result);
                setUiState(result.items.length === 0
                    ? { name: 'empty' }
                    : { name: 'success' });
            } catch (error) {
                if ((error as Error).name === 'AbortError') return;
                let message = 'Не удалось загрузить данные';
                if (error instanceof ApiError) {
                    if (error.status === 0) message = 'Нет подключения к сети.';
                    else if (error.status >= 500) message = `Сервер недоступен (${error.status})`;
                    else if (error.status >= 400) message = `Ошибка запроса (${error.status})`;
                }
                setUiState({ name: 'error', message });
            }
        })();

        return () => controller.abort();
    }, [debouncedQuery, page]);

    // Производные данные — useMemo, не state
    const sortedItems = useMemo(() => {
        if (!data) return [];
        const copy = [...data.items];
        switch (sortBy) {
            case 'title':
                return copy.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
            case 'year':
                return copy.sort((a, b) => (b.first_publish_year ?? 0) - (a.first_publish_year ?? 0));
            case 'rating':
                return copy.sort((a, b) => (b.ratings_average ?? 0) - (a.ratings_average ?? 0));
            default:
                return copy;
        }
    }, [data, sortBy]);

    const wishlistBooks = useMemo(
        () => [...wishlistDetails.values()],
        [wishlistDetails],
    );

    // Обработчики
    const handleToggleWishlist = useCallback((book: Book) => {
        setWishlist((prev) => {
            const next = new Set(prev);
            if (next.has(book.key)) next.delete(book.key);
            else next.add(book.key);
            return next;
        });
        setWishlistDetails((prev) => {
            const next = new Map(prev);
            if (next.has(book.key)) next.delete(book.key);
            else next.set(book.key, book);
            return next;
        });
    }, []);

    const handleReset = useCallback(() => {
        setQuery('');
        setDebouncedQuery('');
        setPage(1);
        setSortBy('title');
        setUiState({ name: 'empty' });
        setData(null);
    }, []);

    const handleRemoveFromWishlist = useCallback((key: string) => {
        setWishlist((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
        });
        setWishlistDetails((prev) => {
            const next = new Map(prev);
            next.delete(key);
            return next;
        });
    }, []);

    const handleSortChange = useCallback((value: SortBy) => {
        setSortBy(value);
    }, []);

    const handleRetry = useCallback(() => {
        if (debouncedQuery.length >= 2) {
            setPage((p) => p); // перезапуск запроса
            // Альтернатива: явный триггер — но так проще
            const controller = new AbortController();
            (async () => {
                setUiState({ name: 'loading' });
                setData(null);
                try {
                    const result = await searchBooks(debouncedQuery, page, controller.signal);
                    setData(result);
                    setUiState(result.items.length === 0
                        ? { name: 'empty' }
                        : { name: 'success' });
                } catch (error) {
                    if ((error as Error).name === 'AbortError') return;
                    let message = 'Не удалось загрузить данные';
                    if (error instanceof ApiError) {
                        if (error.status === 0) message = 'Нет подключения к сети.';
                        else if (error.status >= 500) message = `Сервер недоступен (${error.status})`;
                        else if (error.status >= 400) message = `Ошибка запроса (${error.status})`;
                    }
                    setUiState({ name: 'error', message });
                }
            })();
        }
    }, [debouncedQuery, page]);

    return (
        <>
            <header className="site-header">
                <a href="/">BookNest</a>
                <nav className="site-nav" aria-label="Основная навигация">
                    <ul>
                        <li><a href="/">Каталог</a></li>
                        <li><a href="loan.html">Выдача</a></li>
                    </ul>
                </nav>
                <a href="#wishlist" className="wishlist-link">
                    Мой список <Badge tone="primary">{wishlist.size}</Badge>
                </a>
            </header>

            <main className="container catalog-layout">
                <h1>Каталог книг</h1>

                <FiltersPanel
                    query={query}
                    sortBy={sortBy}
                    onQueryChange={setQuery}
                    onSortChange={handleSortChange}
                    onReset={handleReset}
                />

                <section>
                    {uiState.name === 'loading' && <Spinner />}
                    {uiState.name === 'empty' && <EmptyState message="Ничего не найдено. Попробуйте изменить запрос." />}
                    {uiState.name === 'error' && (
                        <ErrorBox message={uiState.message ?? 'Ошибка'} onRetry={handleRetry} />
                    )}
                    {uiState.name === 'success' && data && (
                        <>
                            <BookList
                                books={sortedItems}
                                wishlist={wishlist}
                                onToggleWishlist={handleToggleWishlist}
                            />
                            <Pagination
                                page={data.page}
                                totalPages={data.totalPages}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </section>

                <Wishlist
                    items={wishlistBooks}
                    onRemove={handleRemoveFromWishlist}
                />
            </main>

            <footer className="site-footer">
                <p>© 2025 BookNest</p>
            </footer>
        </>
    );
}