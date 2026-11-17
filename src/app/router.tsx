import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { RequireAuth } from './RequireAuth';
import { CatalogPage } from '../pages/CatalogPage';
import { BookDetailPage } from '../pages/BookDetailPage';
import { BookFormPage } from '../pages/BookFormPage';
import { WishlistPage } from '../pages/WishlistPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <NotFoundPage />,
        children: [
            { path: '/', element: <CatalogPage /> },
            { path: '/books', element: <CatalogPage /> },
            { path: '/books/new', element: <BookFormPage /> },
            { path: '/books/:bookId', element: <BookDetailPage /> },
            { path: '/books/:bookId/edit', element: <BookFormPage /> },
            {
                element: <RequireAuth />,
                children: [{ path: '/wishlist', element: <WishlistPage /> }],
            },
            { path: '/login', element: <LoginPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);