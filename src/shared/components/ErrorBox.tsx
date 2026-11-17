// src/components/ErrorBox.tsx

import { Button } from './Button';

interface ErrorBoxProps {
    message: string;
    onRetry: () => void;
}

export function ErrorBox({ message, onRetry }: ErrorBoxProps) {
    return (
        <div className="error-box" role="alert">
            <p>{message}</p>
            <Button onClick={onRetry}>Повторить</Button>
        </div>
    );
}