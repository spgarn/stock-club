import { useEffect, useState } from "react";
import { MeetingDecisionsBasic } from "../../../api";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import { green, grey } from "@mui/material/colors";
import dayjs from "dayjs";
import { translate } from "../../../i18n";

const calcProgress = (decision: MeetingDecisionsBasic) => {
    const secondsLeft = dayjs(decision.expiresAt).diff(dayjs(), "seconds");
    const initialSeconds = dayjs(decision.createdAt).diff(dayjs(decision.expiresAt), "seconds");
    return {
        secondsLeft,
        initialSeconds,
        value: Math.round((secondsLeft / initialSeconds) * 1000) / 10
    }
}
export const VoteInProgress = ({ decision, onClick }: { decision: MeetingDecisionsBasic, onClick?: undefined | ((i: number) => void) }) => {
    const [progress, setProgress] = useState(calcProgress(decision));
    useEffect(() => {
        const i = setInterval(() => {
            const p = calcProgress(decision);
            setProgress(p);
            if (p.secondsLeft < 0) {
                clearInterval(i);
            }
        }, 500)
        return () => {
            clearInterval(i);
        }
    }, [decision])
    if (progress.secondsLeft < 0) return <></>
    const buttonSx = {
        width: 150,
        height: 150,
        textTransform: "none",
        bgcolor: grey[300],
        color: "black",
        ...(onClick ? {
            '&:hover': {
                bgcolor: green[700],
            }
        } : {}),
    };
    return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
        <Box sx={{ m: 1, position: 'relative' }}>
            <Fab
                aria-label="save"
                color="primary"
                sx={buttonSx}
                onClick={() => onClick ? onClick(decision.id) : console.log("no")}

            >
                <p>{progress.secondsLeft} {translate["seconds"]}</p>
            </Fab>

            <CircularProgress
                variant="determinate"
                size={163}
                value={progress.value}
                sx={{
                    color: green[500],
                    position: 'absolute',
                    top: -6,
                    left: -6,
                    zIndex: 1,
                }}
            />

        </Box>
    </Box>
}