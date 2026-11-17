// src/App.tsx
import { useState, useEffect } from 'react';
import { useBooks } from './features/books/useBooks';
import { useDebounce } from './shared/hooks/useDebounce';
import { ThemeProvider, useTheme } from './app/providers/ThemeContext';
import { AuthProvider } from './app/providers/AuthContext';
import { Spinner } from './shared/components/Spinner';
import { ErrorBox } from './shared/components/ErrorBox';
import { EmptyState } from './shared/components/EmptyState';
import { BookList } from './shared/components/BookList';
import { Pagination } from './shared/components/Pagination';
import { Button } from './shared/components/Button';

function CatalogContent() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 350);
    const { theme, toggle } = useTheme();

    const { data, loading, error, refetch } = useBooks({
        search: debouncedSearch,
        genre: '',
        page,
    });

    // Сброс страницы при новом поиске
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    return (
        <main className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
                <h1>Каталог</h1>
                <Button onClick={toggle} variant="secondary">
                    Тема: {theme}
                </Button>
            </div>

            <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск книг..."
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
        </main>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CatalogContent />
            </AuthProvider>
        </ThemeProvider>
    );
}