// src/shared/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 350): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        // Очистка эффекта: если value изменится раньше, чем пройдет delay,
        // таймер отменится, и мы не сделаем лишний запрос
        return () => clearTimeout(timer); 
    }, [value, delay]);

    return debounced;
}