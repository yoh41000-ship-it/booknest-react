// src/components/BookList.tsx

import { BookCard } from './BookCard';
import type { Book } from '../types';

interface BookListProps {
    books: Book[];
    wishlist: Set<string>;
    onToggleWishlist: (book: Book) => void;
}

export function BookList({ books, wishlist, onToggleWishlist }: BookListProps) {
    return (
        <div className="catalog-grid">
            {books.map((book) => (
                <BookCard
                    key={book.key}
                    book={book}
                    isWishlisted={wishlist.has(book.key)}
                    onToggleWishlist={onToggleWishlist}
                />
            ))}
        </div>
    );
}