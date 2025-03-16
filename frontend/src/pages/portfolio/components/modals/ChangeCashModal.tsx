import TextField from "@mui/material/TextField"
import { translate } from "../../../../i18n";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { BootstrapDialogTitle } from "../../../../components/BootstrapDialogTitle";
import { useState } from "react";
import useClubs from "../../../../hooks/useClubs";
import Loading from "../../../../components/Loading";
import { Button } from "@mui/material";
import api from "../../../../api";

type ChangeCashModalProps = {
    handleClose: () => void;
    currenctCash: number;
    refetch: () => void;
}

export const ChangeCashModal = ({ handleClose, refetch, currenctCash }: ChangeCashModalProps) => {
    const { activeClub } = useClubs();
    const [cash, setCash] = useState(currenctCash);

    if (!activeClub) {
        return <Loading />;
    }

    const handleSubmit = async () => {
        await api.put("/club/edit/" + activeClub.id, {
            ...activeClub,
            cash: cash,
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        });
        refetch();
        handleClose();
    }

    return (
        <Dialog
            open={true}
            onClose={handleClose}
            fullWidth
        >
            <BootstrapDialogTitle
                onClose={() => handleClose()}
            >
                {translate["update_cash"]}
            </BootstrapDialogTitle>
            <DialogContent>

                <TextField
                    fullWidth={true}
                    label={translate["cash"]}
                    type="text"
                    variant="standard"
                    value={cash}
                    onChange={(e) => setCash(Number(e.target.value))}
                />
                <Button onClick={handleSubmit}>{translate["update"]}</Button>
            </DialogContent>
        </Dialog>

    );
};
