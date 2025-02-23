import { useAppContext } from '../contexts/useAppContext';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAppContext();
    useEffect(() => {
        if (user !== undefined) {
            if (user && !location.pathname.startsWith("/club/")) {
                navigate("/club/home");
            } else if (!user && location.pathname != "/reset-password" && location.pathname != "/register" && location.pathname != "/login" && !location.pathname.startsWith("/public")) {
                navigate("/login");
            }
        }

    }, [navigate, user, location]);
    return (
        <Outlet />
    )
}
