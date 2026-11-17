import { Link, useParams } from 'react-router-dom';
import { useBook } from '../features/books/useBook';
import { ApiError } from '../api/api-client';
import { Spinner } from '../shared/components/Spinner';
import { ErrorBox } from '../shared/components/ErrorBox';
import { getCoverUrl } from '../api/books';

export function BookDetailPage() {
    const { bookId } = useParams<{ bookId: string }>();
    const { data: book, loading, error, refetch } = useBook(bookId);

    if (loading) return <Spinner />;

    if (error) {
        if (error instanceof ApiError && error.status === 404) {
            return (
                <section style={{ textAlign: 'center', padding: '3rem' }}>
                    <h1>Книга не найдена</h1>
                    <Link to="/books">← В каталог</Link>
                </section>
            );
        }
        return <ErrorBox message={error.message} onRetry={refetch} />;
    }

    if (!book) return null;
    const cover = getCoverUrl(book.cover_i, 'L');

    return (
        <article style={{ padding: '2rem 0' }}>
            <Link to="/books">← К каталогу</Link>
            <h1>{book.title}</h1>
            {cover && <img src={cover} alt={`Обложка «${book.title}»`} width={300} />}
            <p>Автор: {book.author_name?.join(', ') ?? '—'}</p>
            <p>Год: {book.first_publish_year ?? '—'}</p>
            <Link to={`/books/${encodeURIComponent(book.key)}/edit`}>Редактировать</Link>
        </article>
    );
}