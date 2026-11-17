import { z } from 'zod';

export const bookFormSchema = z
    .object({
        title: z.string().trim().min(1, 'Введите название').max(200, 'Не более 200 символов'),
        author: z.string().trim().min(1, 'Введите автора').max(120, 'Не более 120 символов'),
        genre: z.string().min(1, 'Выберите жанр'),
        pages: z.coerce.number().int('Только целое').min(1, 'Минимум 1 страница').max(20000, 'Слишком много'),
        writtenYear: z.coerce.number().int().min(1000, 'Год от 1000').max(2100, 'Год до 2100'),
        publishedYear: z.coerce.number().int().min(1000, 'Год от 1000').max(2100, 'Год до 2100'),
        description: z.string().max(1000, 'Не более 1000 символов'),
    })
    .refine((d) => d.publishedYear >= d.writtenYear, {
        message: 'Год издания не может быть раньше года написания',
        path: ['publishedYear'],
    });

export type BookFormValues = z.infer<typeof bookFormSchema>;