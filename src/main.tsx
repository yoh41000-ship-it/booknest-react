import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';

async function enableMocking() {
    if (import.meta.env.DEV) {
        const { worker } = await import('./mocks/browser');
        // Вот здесь мы говорим MSW перехватывать всё
        return worker.start({ onUnhandledRequest: 'bypass' });
    }
}

enableMocking().then(() => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
});