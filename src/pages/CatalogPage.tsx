import { useSearchParams, Link } from 'react-router-dom';
import { useBooks } from '../features/books/useBooks';
import { useDebounce } from '../shared/hooks/useDebounce';
import { BookList } from '../shared/components/BookList';
import { Pagination } from '../shared/components/Pagination';
import { Spinner } from '../shared/components/Spinner';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorBox } from '../shared/components/ErrorBox';
import { Button } from '../shared/components/Button';
import { useState, useEffect } from 'react';

export function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const page = Number(searchParams.get('page') ?? '1');

    const [input, setInput] = useState(search);
    const debounced = useDebounce(input, 350);

    useEffect(() => {
        if (debounced === search) return;
        const next = new URLSearchParams(searchParams);
        if (debounced) next.set('search', debounced);
        else next.delete('search');
        next.set('page', '1');
        setSearchParams(next, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

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
                    <BookList books={data.items} wishlist={new Set()} onToggleWishlist={() => {}} />
                    <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
                </>
            )}
        </>
    );
}