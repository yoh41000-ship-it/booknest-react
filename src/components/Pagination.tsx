// src/components/Pagination.tsx

import { Button } from './Button';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    return (
        <nav className="pagination" aria-label="Пагинация">
            <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                ← Назад
            </Button>
            <span>Страница {page} из {totalPages || 1}</span>
            <Button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                Вперёд →
            </Button>
        </nav>
    );
}
