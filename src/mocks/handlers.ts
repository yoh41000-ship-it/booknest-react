import { http, HttpResponse } from 'msw';
import type { Book } from '../types';

const books: Book[] = [
    { key: '/works/OL1W', title: 'Властелин колец', author_name: ['Толкин'], first_publish_year: 1954, cover_i: 123 },
];

export const handlers = [
    http.get('https://openlibrary.org/search.json', () =>
        HttpResponse.json({ numFound: books.length, docs: books }),
    ),
    http.get('https://openlibrary.org/works/:id.json', ({ params }) => {
        const book = books.find((b) => b.key === `/works/${params.id}`);
        if (!book) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(book);
    }),
    http.post('https://openlibrary.org/books', async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        if (body.title === 'дубль') {
            return HttpResponse.json(
                { message: 'Проверьте поля', fieldErrors: { title: 'Такое название уже есть', author: 'Автор обязателен на сервере' } },
                { status: 422 },
            );
        }
        if (body.title === 'конфликт') {
            return HttpResponse.json({ message: 'Книга с таким названием уже существует' }, { status: 409 });
        }
        if (body.title === 'ошибка') {
            return new HttpResponse(null, { status: 500 });
        }
        return HttpResponse.json({ ...books[0], title: body.title as string });
    }),
];