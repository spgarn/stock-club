import DialogTitle, { DialogTitleProps } from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
export const BootstrapDialogTitle = (
    props: DialogTitleProps & { onClose: () => void }
) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};