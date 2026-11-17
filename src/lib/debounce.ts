// src/lib/debounce.ts

export function debounce<T extends (...args: never[]) => void>(
    fn: T,
    delay = 350,
): (...args: Parameters<T>) => void {
    let timerId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn(...args), delay);
    };
}