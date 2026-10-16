// src/components/BookCard.tsx

import { Badge } from './Badge';
import { Button } from './Button';
import { getCoverUrl } from '../api/books';
import type { Book } from '../types';

interface BookCardProps {
    book: Book;
    isWishlisted: boolean;
    onToggleWishlist: (book: Book) => void;
}

export function BookCard({ book, isWishlisted, onToggleWishlist }: BookCardProps) {
    const coverUrl = getCoverUrl(book.cover_i);
    const author = book.author_name?.join(', ') ?? 'Автор неизвестен';

    return (
        <article className="book-card">
            <h3>
                <a href={`book.html?id=${encodeURIComponent(book.key)}`}>
                    {book.title}
                </a>
            </h3>
            {coverUrl && (
                <figure>
                    <img src={coverUrl} alt={`Обложка «${book.title}»`} width={150} height={220} loading="lazy" />
                </figure>
            )}
            <p>Автор: {author}</p>
            <p>
                Год: {book.first_publish_year ?? '—'} ·{' '}
                {book.ratings_average ? (
                    <Badge tone="primary">★ {book.ratings_average.toFixed(1)}</Badge>
                ) : '—'}
            </p>
            <Button
                variant={isWishlisted ? 'secondary' : 'primary'}
                aria-pressed={isWishlisted}
                onClick={() => onToggleWishlist(book)}
            >
                {isWishlisted ? '★ В списке' : '☆ Хочу прочитать'}
            </Button>
        </article>
    );
}