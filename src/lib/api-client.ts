// src/lib/api-client.ts

const BASE_URL = 'https://openlibrary.org';

export class ApiError extends Error {
    public readonly status: number;

    constructor(message: string, status = 0) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export async function apiGet<T>(
    path: string,
    params: Record<string, string | number> = {},
    signal?: AbortSignal,
): Promise<T> {
    const url = new URL(path, BASE_URL);
    url.search = new URLSearchParams(
        Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, String(v)]),
        ),
    ).toString();

    let response: Response;
    try {
        response = await fetch(url.toString(), { signal });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') throw error;
        throw new ApiError('Нет подключения к сети', 0);
    }

    if (!response.ok) {
        const message = response.status >= 500
            ? 'Сервер временно недоступен'
            : 'Запрос отклонён';
        throw new ApiError(message, response.status);
    }

    return response.json() as Promise<T>;
}