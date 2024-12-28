import { Button, Typography } from "@mui/material";
import { useAppContext } from "../contexts/useAppContext";
import { translate } from "../i18n";

export default function ErrorMessage({ error, withLogout = false }: { error: string; withLogout?: boolean }) {
    const { logout } = useAppContext();
    if (error.length === 0) {
        return <p></p>
    }
    return (
        <div className="error-container">
            <Typography variant="h5" className='error'>{error}</Typography>
            {withLogout && <Button variant="contained" onClick={logout}>{translate["logout"]}</Button>}

        </div>
    )
}
