import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookFormSchema, type BookFormValues } from './bookSchema';
import { createBook, updateBook } from '../../api/books';
import { ApiError } from '../../api/api-client';
import { Button } from '../../shared/components/Button';
import type { Book } from '../../types';

interface BookFormProps {
    mode: 'create' | 'edit';
    initial?: Book;
    onSuccess: (book: Book) => void;
}

const EMPTY: BookFormValues = {
    title: '', author: '', genre: '', pages: 1,
    writtenYear: 2000, publishedYear: 2000, description: '',
};

export function BookForm({ mode, initial, onSuccess }: BookFormProps) {
    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting, isDirty } } = useForm<BookFormValues>({
        resolver: zodResolver(bookFormSchema),
        defaultValues: EMPTY,
    });

    // Защита от потери данных
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        if (mode === 'edit' && initial) {
            reset({
                title: initial.title ?? '',
                author: initial.author_name?.join(', ') ?? '',
                genre: 'fiction',
                pages: 100,
                writtenYear: initial.first_publish_year ?? 2000,
                publishedYear: initial.first_publish_year ?? 2000,
                description: '',
            });
        }
    }, [mode, initial, reset]);

    const onSubmit = handleSubmit(async (values) => {
        try {
            const saved = mode === 'create' ? await createBook(values) : await updateBook(initial!.key, values);
            onSuccess(saved);
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 422 && err.fieldErrors) {
                    Object.entries(err.fieldErrors).forEach(([field, message]) => {
                        setError(field as keyof BookFormValues, { type: 'server', message });
                    });
                } else if (err.status === 409) {
                    setError('title', { type: 'server', message: err.message });
                } else {
                    setError('root.server', { type: 'server', message: err.message });
                }
            } else {
                setError('root.server', { type: 'server', message: 'Неизвестная ошибка' });
            }
        }
    });

    const field = (name: keyof BookFormValues) => ({
        'aria-invalid': !!errors[name],
        'aria-describedby': errors[name] ? `${name}-error` : undefined,
    });

    return (
        <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
            <h1>{mode === 'create' ? 'Новая книга' : 'Редактирование'}</h1>

            {errors.root?.server && <p role="alert" style={{ color: 'red' }}>{errors.root.server.message}</p>}

            <div>
                <label htmlFor="title">Название</label>
                <input id="title" {...register('title')} {...field('title')} style={{ width: '100%' }} />
                {errors.title && <p id="title-error" role="alert" style={{ color: 'red', fontSize: '0.875rem' }}>{errors.title.message}</p>}
            </div>
            <div>
                <label htmlFor="author">Автор</label>
                <input id="author" {...register('author')} {...field('author')} style={{ width: '100%' }} />
                {errors.author && <p id="author-error" role="alert" style={{ color: 'red', fontSize: '0.875rem' }}>{errors.author.message}</p>}
            </div>
            <div>
                <label htmlFor="genre">Жанр</label>
                <select id="genre" {...register('genre')} {...field('genre')} style={{ width: '100%' }}>
                    <option value="">— выберите —</option>
                    <option value="fiction">Проза</option>
                    <option value="fantasy">Фэнтези</option>
                    <option value="science">Наука</option>
                </select>
                {errors.genre && <p id="genre-error" role="alert" style={{ color: 'red', fontSize: '0.875rem' }}>{errors.genre.message}</p>}
            </div>
            <div>
                <label htmlFor="pages">Страниц</label>
                <input id="pages" type="number" {...register('pages')} {...field('pages')} style={{ width: '100%' }} />
                {errors.pages && <p id="pages-error" role="alert" style={{ color: 'red', fontSize: '0.875rem' }}>{errors.pages.message}</p>}
            </div>
            <div>
                <label htmlFor="writtenYear">Год написания</label>
                <input id="writtenYear" type="number" {...register('writtenYear')} {...field('writtenYear')} style={{ width: '100%' }} />
                {errors.writtenYear && <p id="writtenYear-error" role="alert" style={{ color: 'red', fontSize: '0.875rem' }}>{errors.writtenYear.message}</p>}
            </div>
            <div>
                <label htmlFor="publishedYear">Год издания</label>
                <input id="publishedYear" type="number" {...register('publishedYear')} {...field('publishedYear')} style={{ width: '100%' }} />
                {errors.publishedYear && <p id="publishedYear-error" role="alert" style={{ color: 'red', fontSize: '0.875rem' }}>{errors.publishedYear.message}</p>}
            </div>
            <div>
                <label htmlFor="description">Описание</label>
                <textarea id="description" rows={4} {...register('description')} {...field('description')} style={{ width: '100%' }} />
                {errors.description && <p id="description-error" role="alert" style={{ color: 'red', fontSize: '0.875rem' }}>{errors.description.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохраняем…' : 'Сохранить'}
            </Button>
        </form>
    );
}