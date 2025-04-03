
import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate, translateText } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import meetingStyles from "../meeting.module.scss";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api, { MeetingDecisionsBasic } from "../../../api";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown } from "@fortawesome/free-regular-svg-icons/faThumbsDown";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons/faThumbsUp";
import Box from "@mui/material/Box";
import { VoteInProgress } from "./VoteInProgress";
export type NewVote = {
    clubId: number;
    meetingId: number;
    decisionId: number;
    vote: "upvote" | "downvote"
}

export default function DecisionVoteModal({ handleClose, refetch, clubId, meetingId, decision, reaction }: { handleClose: () => void; refetch: () => void; clubId: number; meetingId: number; decision: MeetingDecisionsBasic; reaction: "upvote" | "abstain" | "downvote" | null }) {

    const [loading, setLoading] = useState(false);
    const react = async (reaction: "upvote" | "downvote") => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await api.post<unknown>
                ("meeting_decisions/react", {
                    clubId,
                    meetingId,
                    decisionId: decision.id,
                    isUpvote: reaction == "upvote"
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            refetch();
            handleClose();
            console.log(resData);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data) {
                    toast.error(translateText(err.response?.data?.title, err.response?.data?.title));
                } else {
                    toast.error(err.message);
                }
            } else {
                toast.error(translate["something_went_wrong"])
            }
        }
        setLoading(false);
    }
    return (
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

            <DialogContent>
                <div>
                    <Typography variant='h6' sx={{ textAlign: "center", marginBottom: "1rem" }}>"{decision.title}"</Typography>
                </div>

                <VoteInProgress decision={decision} />

                <Box sx={{ display: "flex", flex: "1", gap: "5px", justifyContent: "space-around", width: "100%" }}>
                    <div onClick={() => react("upvote")} className={meetingStyles.reactButtonModal + " "} role='button' aria-label={translate["upvote"]} title={translate["upvote"]}>
                        <FontAwesomeIcon icon={faThumbsUp} size="2x" />
                    </div>
                    <div onClick={() => react("downvote")} className={meetingStyles.reactButtonModal + " "} role='button' aria-label={translate["downvote"]} title={translate["downvote"]}>
                        <FontAwesomeIcon icon={faThumbsDown} size="2x" />
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
