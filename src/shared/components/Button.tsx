// src/components/Button.tsx

import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary';
}

export function Button({ children, variant = 'primary', className = '', ...rest }: ButtonProps) {
    return (
        <button type="button" className={`btn btn--${variant} ${className}`} {...rest}>
            {children}
        </button>
    );
}