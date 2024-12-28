import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/main.scss'
import './styles/auth.scss'
import App from './App.tsx'
import 'react-toastify/dist/ReactToastify.css'
import { blue } from '@mui/material/colors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const theme = createTheme({
    palette: {
        primary: {
            main: blue[500],
        },
    },
});
export const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </QueryClientProvider>
        <ToastContainer />
    </StrictMode>,
)
