import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ThemeProvider } from './app/providers/ThemeContext';
import { AuthProvider } from './app/providers/AuthContext';

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    );
}