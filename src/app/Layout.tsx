import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './providers/AuthContext';
import { useTheme } from './providers/ThemeContext';
import { Badge } from '../shared/components/Badge';
import { Button } from '../shared/components/Button';

export function Layout() {
    const { user, logout } = useAuth();
    const { theme, toggle } = useTheme();

    return (
        <>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
                <NavLink to="/books" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>BookNest</NavLink>
                <nav style={{ display: 'flex', gap: '1rem' }}>
                    <NavLink to="/books">Каталог</NavLink>
                    <NavLink to="/wishlist">Список <Badge tone="primary">★</Badge></NavLink>
                </nav>
                <div>
                    <Button variant="secondary" onClick={toggle}>
                        {theme === 'light' ? '🌙' : '☀️'}
                    </Button>
                    {user ? (
                        <Button variant="secondary" onClick={logout}>Выйти ({user.name})</Button>
                    ) : (
                        <NavLink to="/login">Войти</NavLink>
                    )}
                </div>
            </header>
            <main className="container" style={{ padding: '2rem' }}>
                <Outlet />
            </main>
            <footer style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #ccc' }}>
                <p>© 2025 BookNest</p>
            </footer>
        </>
    );
}