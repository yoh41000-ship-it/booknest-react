import { http, HttpResponse } from 'msw';
import type { Book } from '../types';

export const handlers = [
    // Обработка 422 (ошибки на полях)
    http.post('https://openlibrary.org/books', async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        if (body.title === 'дубль') {
            return HttpResponse.json(
                { 
                    message: 'Проверьте поля', 
                    fieldErrors: { 
                        title: 'Такое название уже есть', 
                        author: 'Автор обязателен на сервере' 
                    } 
                },
                { status: 422 },
            );
        }
        if (body.title === 'конфликт') {
            return HttpResponse.json(
                { message: 'Книга с таким названием уже существует' }, 
                { status: 409 }
            );
        }
        if (body.title === 'ошибка') {
            return new HttpResponse(null, { status: 500 });
        }
        
        // Имитация успешного создания
        const savedBook: Book = {
            key: `/works/OL${Date.now()}`,
            title: String(body.title || 'Новая книга'),
            author_name: body.author ? [String(body.author)] : [],
            first_publish_year: Number(body.publishedYear) || undefined,
        };
        return HttpResponse.json(savedBook);
    }),
];