import { useMemo, useEffect, useState, useCallback } from 'react';
import { Wishlist } from '../shared/components/Wishlist';
import type { Book } from '../types';

const KEY = 'booknest.wishlist.v3';

export function WishlistPage() {
    const [items, setItems] = useState<Map<string, Book>>(() => {
        try {
            const raw = localStorage.getItem(KEY);
            return raw ? new Map(JSON.parse(raw)) : new Map();
        } catch { return new Map(); }
    });

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify([...items]));
    }, [items]);

    const remove = useCallback((key: string) => {
        setItems((prev) => {
            const next = new Map(prev);
            next.delete(key);
            return next;
        });
    }, []);

    const list = useMemo(() => [...items.values()], [items]);
    return <Wishlist items={list} onRemove={remove} />;
}