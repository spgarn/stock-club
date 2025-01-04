import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "./BootstrapDialogTitle";
import { translate } from "../i18n";
import DialogContent from "@mui/material/DialogContent";
import { Club } from "../api";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
export type NewMeeting = {
    name: string;
    location: string;
    time: Date;
    description: string;
    agenda: string;
    meetingProtocols: string;
}
// };
export default function ConfirmClub({ handleClose, clubs, pickClub, clubId }: { handleClose: () => void; clubs: Club[], pickClub: (id: number) => void, clubId: number }) {
    return (
        <Dialog
            open={true}
            // onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="sm"
        >
            <BootstrapDialogTitle
                id="alert-dialog-title"
                onClose={() => handleClose()}
            >
                {translate["choose_club"]}
            </BootstrapDialogTitle>

            <DialogContent>

                <div>
                    <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        {clubs.map((club, index) => <ListItemButton disabled={clubId == club.id} key={club.id} onClick={() => {
                            pickClub(club.id)
                            handleClose();
                        }}>
                            <ListItemText primary={`${index + 1}. ${club.name} ${clubId == club.id ? (" <- " + translate["chosen"]) : ""}`} />
                        </ListItemButton>)}
                    </List>
                </div>
            </DialogContent>
        </Dialog>
    )
}
