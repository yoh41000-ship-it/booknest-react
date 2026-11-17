import { useNavigate, useParams } from 'react-router-dom';
import { useBook } from '../features/books/useBook';
import { BookForm } from '../features/books/BookForm';
import { Spinner } from '../shared/components/Spinner';

export function BookFormPage() {
    const { bookId } = useParams<{ bookId?: string }>();
    const mode = bookId ? 'edit' : 'create';
    const navigate = useNavigate();
    const { data: initial, loading, error } = useBook(bookId);

    if (mode === 'edit' && loading) return <Spinner />;
    if (mode === 'edit' && error) return <p role="alert">Не удалось загрузить книгу: {error.message}</p>;

    return (
        <BookForm
            mode={mode}
            initial={initial ?? undefined}
            onSuccess={(saved) => {
                const id = saved.key.startsWith('/') ? saved.key.replace('/works/', '') : saved.key;
                navigate(`/books/${encodeURIComponent(id)}`, { replace: true });
            }}
        />
    );
}