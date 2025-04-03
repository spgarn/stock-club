
import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import homeStyles from "../../home/home.module.scss";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown } from "@fortawesome/free-regular-svg-icons/faThumbsDown";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons/faThumbsUp";
import Box from "@mui/material/Box";
import { DecisionVoteResults } from "../Meeting";
import { styled } from "@mui/material/styles";
import { common, green, red } from "@mui/material/colors";
import { Confetti } from "./Confetti";
export type NewVote = {
    clubId: number;
    meetingId: number;
    decisionId: number;
    vote: "upvote" | "downvote"
}

const SuccessText = styled(Typography)(() => ({
    padding: 4,
    color: green[400]
}));

const FailText = styled(Typography)(() => ({
    padding: 4,
    color: red[400]
}));

const TieText = styled(Typography)(() => ({
    padding: 4,
    color: common["black"]
}));

export default function DecisionVoteResultsModal({ handleClose, results }: { handleClose: () => void; results: DecisionVoteResults }) {
    const getResult = () => {
        if (results.upvotes > results.downvotes) {
            return <SuccessText>{translate["decision_win"]} {results.upvotes - results.downvotes} {translate["votes"]}</SuccessText>
        }
        if (results.upvotes < results.downvotes) {
            return <FailText>{translate["decision_lose"]} {results.upvotes - results.downvotes} {translate["votes"]}</FailText>
        }
        return <TieText>{translate["decision_tie"]}</TieText>
    }
    return (
        <>
            <Dialog
                open={true}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="xs"
            >
                <BootstrapDialogTitle
                    id="alert-dialog-title"
                    onClose={() => handleClose()}
                >
                    {translate["vote_decision"]}
                </BootstrapDialogTitle>
                {getResult()}
                <DialogContent>
                    <div>
                        <Typography variant='h6' sx={{ textAlign: "center", marginBottom: "1rem" }}>"{results.decision.title}"</Typography>
                    </div>
                    { }
                    <Box sx={{ display: "flex", flex: "1", gap: "5px", justifyContent: "space-around", width: "100%" }}>
                        <div className={homeStyles.reactButton} aria-label={translate["upvote"]} title={translate["upvote"]}>
                            {results.upvotes}
                            <FontAwesomeIcon icon={faThumbsUp} size="2x" />
                        </div>
                        <div className={homeStyles.reactButton} aria-label={translate["downvote"]} title={translate["downvote"]}>
                            {results.downvotes}
                            <FontAwesomeIcon icon={faThumbsDown} size="2x" />
                        </div>
                    </Box>
                </DialogContent>
            </Dialog>
            {results.upvotes > results.downvotes && <Confetti />}
        </>
    )
}
