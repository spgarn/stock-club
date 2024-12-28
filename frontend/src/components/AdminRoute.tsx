import { Outlet } from 'react-router-dom'
import NoPermission from './NoPermission';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api';

export default function AdminRoute() {
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
    });
    if (!user || !user.admin) {
        return <NoPermission />
    }
    return <Outlet />
}
