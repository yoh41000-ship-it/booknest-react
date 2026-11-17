// src/api/api-client.ts

const BASE_URL = 'https://openlibrary.org';

// Вот этот класс мы случайно удалили!
export class ApiError extends Error {
    public readonly status: number;
    public readonly fieldErrors?: Record<string, string>;

    constructor(message: string, status = 0, fieldErrors?: Record<string, string>) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

export async function apiRequest<T>(
    path: string,
    options: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        params?: Record<string, string | number>;
        body?: unknown;
        signal?: AbortSignal;
    } = {},
): Promise<T> {
    const { method = 'GET', params = {}, body, signal } = options;
    const url = new URL(path, BASE_URL);
    url.search = new URLSearchParams(
        Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    ).toString();

    // Отправляем Content-Type только если есть тело запроса (чтобы не ловить CORS на GET)
    const headers: Record<string, string> = {};
    if (body) {
        headers['Content-Type'] = 'application/json';
    }

    let response: Response;
    try {
        response = await fetch(url.toString(), {
            method,
            signal,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') throw error;
        throw new ApiError('Нет подключения к сети', 0);
    }

    if (!response.ok) {
        let fieldErrors: Record<string, string> | undefined;
        let message = response.status >= 500 ? 'Сервер временно недоступен' : 'Запрос отклонён';
        try {
            const payload = await response.json();
            if (payload?.message) message = payload.message;
            if (payload?.fieldErrors) fieldErrors = payload.fieldErrors;
        } catch { /* нет тела — ок */ }
        throw new ApiError(message, response.status, fieldErrors);
    }

    return response.json() as Promise<T>;
}