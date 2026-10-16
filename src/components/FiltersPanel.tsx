// src/components/FiltersPanel.tsx

import { Button } from './Button';
import type { SortBy } from '../types';

interface FiltersPanelProps {
    query: string;
    sortBy: SortBy;
    onQueryChange: (value: string) => void;
    onSortChange: (value: SortBy) => void;
    onReset: () => void;
}

export function FiltersPanel({
    query, sortBy, onQueryChange, onSortChange, onReset,
}: FiltersPanelProps) {
    return (
        <form className="filters" onSubmit={(e) => e.preventDefault()}>
            <h2>Поиск</h2>
            <p className="form-field">
                <label htmlFor="search">Название или автор</label>
                <input
                    id="search"
                    type="search"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Введите минимум 2 символа"
                    maxLength={100}
                />
            </p>
            <p className="form-field">
                <label htmlFor="sort">Сортировка</label>
                <select id="sort" value={sortBy} onChange={(e) => onSortChange(e.target.value as SortBy)}>
                    <option value="title">По названию (А–Я)</option>
                    <option value="year">По году (новые)</option>
                    <option value="rating">По рейтингу</option>
                </select>
            </p>
            <Button onClick={onReset}>Сбросить фильтры</Button>
        </form>
    );
}