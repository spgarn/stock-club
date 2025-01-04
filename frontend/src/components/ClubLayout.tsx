import { Outlet, NavLink } from 'react-router-dom'
import { useAppContext } from '../contexts/useAppContext';
import NoPermission from './NoPermission';
import { translate } from '../i18n';
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ErrorMessage from './ErrorMessage';
import useClubs from '../hooks/useClubs';
import ConfirmClub from './ConfirmClub';

export default function ClubLayout() {
    const { user, logout } = useAppContext();
    const { clubs: data, error, activeClub: latestClub, pickClub, clubId } = useClubs();
    const [confirmClub, setConfirmClub] = useState(false);
    console.log(error);
    useEffect(() => {
        console.log(error);
        if (error?.message?.includes("401")) {
            //No permission, cookie expired
            toast.error("Token expired, please log out and back in");
        }
    }, [error])
    if (!user) {
        return <NoPermission />
    }

    if (data && data.length === 0) {
        //Not part of any club
        return <ErrorMessage error={translate["no_club"]} withLogout={true} />
    }
    return (
        <div className='container'>
            <header>
                <div className='content-header'>
                    <Typography variant='h4'>{latestClub?.name ?? "Loading Club..."}</Typography>
                    {(data ?? []).length > 1 ? <Button onClick={() => setConfirmClub(true)}>{translate["change_club"]}</Button> : <div></div>}
                </div>
                <nav className='main-nav'>
                    <div className="inner-nav">
                        <NavLink
                            to={"/club/home"}
                            className={({ isActive }) => (isActive ? "active" : "")}

                        >
                            {translate["meetsAndProposals"]}
                        </NavLink>
                        <NavLink
                            to={"/club/portfolio"}
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            {translate["portfolio"]}
                        </NavLink>
                        <NavLink
                            to={"/club/news"}
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            {translate["news"]}
                        </NavLink>
                        <NavLink
                            to={"/club/templates"}
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            {translate["templates"]}
                        </NavLink>
                        <NavLink
                            to={"/club/members"}
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            {translate["members"]}
                        </NavLink>
                        <p
                            role='button'
                            onClick={logout}
                            className={""}
                        >
                            {translate["logout"]}
                        </p>
                    </div>
                </nav>
            </header>
            <main className='mt-12'>
                <Outlet />
            </main>
            {confirmClub && !!data && <ConfirmClub clubs={data} pickClub={pickClub} handleClose={() => setConfirmClub(false)} clubId={clubId} />}
        </div>
    )
}
