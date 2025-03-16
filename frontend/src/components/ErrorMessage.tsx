import { Button, Typography } from "@mui/material";
import { useAppContext } from "../contexts/useAppContext";
import { translate } from "../i18n";

export default function ErrorMessage({ error, withLogout = false, withCreateNewClub = false, createClub }: { error: string; withLogout?: boolean, withCreateNewClub?: boolean, createClub?: () => void }) {
    const { logout } = useAppContext();
    if (error.length === 0) {
        return <p></p>
    }
    return (
        <div className="error-container">
            <Typography variant="h5" className='error'>{error}</Typography>

            <div style={{ display: "flex", gap: "12px" }}>
                {withCreateNewClub && <Button variant="contained" onClick={createClub}>{translate["create_new"]}</Button>}
                {withLogout && <Button variant="contained" onClick={logout}>{translate["logout"]}</Button>}

            </div>
        </div>
    )
}
