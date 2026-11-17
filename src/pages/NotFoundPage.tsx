import { Link } from 'react-router-dom';

export function NotFoundPage() {
    return (
        <section style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1>404</h1>
            <p>Страница не найдена</p>
            <Link to="/books">← Вернуться в каталог</Link>
        </section>
    );
}