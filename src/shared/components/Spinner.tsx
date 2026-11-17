// src/components/Spinner.tsx

export function Spinner() {
    return (
        <p role="status" aria-live="polite" className="spinner">
            Загрузка…
        </p>
    );
}