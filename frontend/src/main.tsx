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
    breakpoints: {
        values: {
            xs: 0,    // small phones
            sm: 600,  // tablets
            md: 960,  // small laptops
            lg: 1280, // desktops
            xl: 1920, // large screens
        },
    },
    palette: {
        primary: {
            main: blue[500],
        },
    },
    typography: {
        h1: {
            fontSize: "4rem",
            [`@media (max-width: ${960}px)`]: { // manually using the value of 'xs'
                fontSize: "3rem",
            },
        },
        h2: {
            fontSize: "3rem",
            [`@media (max-width: ${700}px)`]: {
                fontSize: "2rem",
            },
        },
        h3: {
            fontSize: "2.2rem",
            [`@media (max-width: ${700}px)`]: {
                fontSize: "1.5rem",
            },
        },
        h4: {
            fontSize: "1.8rem",
            [`@media (max-width: ${700}px)`]: {
                fontSize: "1.2rem",
            },
        },
        h5: {
            fontSize: "1.4rem",
            [`@media (max-width: ${700}px)`]: {
                fontSize: "0.9rem",
            },
        },
        h6: {
            fontSize: "1rem",
            [`@media (max-width: ${700}px)`]: {
                fontSize: "0.7rem",
            },
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
