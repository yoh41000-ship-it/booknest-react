// src/components/Wishlist.tsx

import { EmptyState } from './EmptyState';
import { Button } from './Button';
import type { Book } from '../types';

interface WishlistProps {
    items: Book[];
    onRemove: (key: string) => void;
}

export function Wishlist({ items, onRemove }: WishlistProps) {
    return (
        <section id="wishlist" aria-labelledby="wishlist-heading">
            <h2 id="wishlist-heading">Мой список желаемого</h2>
            {items.length === 0 ? (
                <EmptyState message="Список пуст" />
            ) : (
                <ul className="wishlist-list">
                    {items.map((book) => (
                        <li key={book.key} className="wishlist-item">
                            <span>{book.title} — {book.author_name?.join(', ')}</span>
                            <Button variant="secondary" onClick={() => onRemove(book.key)}>
                                Удалить
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
