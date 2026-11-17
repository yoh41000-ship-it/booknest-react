import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBooks } from '../features/books/useBooks';
import { useDebounce } from '../shared/hooks/useDebounce';
import { BookList } from '../shared/components/BookList';
import { Pagination } from '../shared/components/Pagination';
import { Spinner } from '../shared/components/Spinner';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorBox } from '../shared/components/ErrorBox';
import { Button } from '../shared/components/Button';
import type { Book } from '../types';

const WISHLIST_KEY = 'booknest.wishlist.v3';

export function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const page = Number(searchParams.get('page') ?? '1');

    const [input, setInput] = useState(search);
    const debounced = useDebounce(input, 350);

    // Состояние для списка желаемого
    const [wishlist, setWishlist] = useState<Map<string, Book>>(() => {
        try {
            const raw = localStorage.getItem(WISHLIST_KEY);
            return raw ? new Map(JSON.parse(raw)) : new Map();
        } catch { return new Map(); }
    });

    // Синхронизация с localStorage
    useEffect(() => {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist]));
    }, [wishlist]);

    // Переключение книги в избранное
    const handleToggleWishlist = useCallback((book: Book) => {
        setWishlist((prev) => {
            const next = new Map(prev);
            if (next.has(book.key)) {
                next.delete(book.key);
            } else {
                next.set(book.key, book);
            }
            return next;
        });
    }, []);

    // Множество ключей для быстрой проверки (isWishlisted)
    const wishlistKeys = useMemo(() => new Set(wishlist.keys()), [wishlist]);

    useEffect(() => {
        if (debounced === search) return;
        const next = new URLSearchParams(searchParams);
        if (debounced) next.set('search', debounced); else next.delete('search');
        next.set('page', '1');
        setSearchParams(next, { replace: true });
    }, [debounced, search, searchParams, setSearchParams]);

    const { data, loading, error, refetch } = useBooks({ search, genre: '', page });

    const setPage = (p: number) => {
        const next = new URLSearchParams(searchParams);
        next.set('page', String(p));
        setSearchParams(next);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                <h1>Каталог книг</h1>
                <Link to="/books/new"><Button>+ Добавить книгу</Button></Link>
            </div>

            <input
                type="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Поиск"
                aria-label="Поиск книг"
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />

            {loading && <Spinner />}
            {error && <ErrorBox message={error.message} onRetry={refetch} />}
            {!loading && !error && data && data.items.length === 0 && (
                <EmptyState message="Ничего не найдено" />
            )}
            {!loading && !error && data && data.items.length > 0 && (
                <>
                    <BookList 
                        books={data.items} 
                        wishlist={wishlistKeys} 
                        onToggleWishlist={handleToggleWishlist} 
                    />
                    <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
                </>
            )}
        </>
    );
}