import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthContext';
import { Button } from '../shared/components/Button';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/books';

    const handleLogin = () => {
        login();
        navigate(from, { replace: true });
    };

    return (
        <section style={{ maxWidth: 400, margin: '4rem auto', textAlign: 'center' }}>
            <h1>Вход</h1>
            <p>Заглушка — авторизация появится в ЛР9.</p>
            <Button onClick={handleLogin}>Войти как Student</Button>
        </section>
    );
}