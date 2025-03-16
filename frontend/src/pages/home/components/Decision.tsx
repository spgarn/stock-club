import { MeetingDecisions, User } from '../../../api'
import dayjs from "dayjs";
import homeStyles from "../home.module.scss";
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown } from "@fortawesome/free-regular-svg-icons/faThumbsDown";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons/faThumbsUp";
import { translate } from '../../../i18n';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
export default function Decision({ user, decision, react, removeDecision }: { user: User, decision: MeetingDecisions; react: (meetingId: number, isUpvote: boolean) => void; removeDecision: (meetingId: number) => void }) {
    const userHasUpvoted = decision.meetingsDecisionsUpvotes.find(upvote => upvote.userId === user.id);
    const userHasDownvoted = decision.meetingsDecisionsDownvotes.find(downvote => downvote.userId === user.id);
    const isYou = user.email === decision.user.email;

    return (
        <div className={`${homeStyles.suggestion} suggestion-card`}>
            <div className={homeStyles.suggestionHeader}>{dayjs(decision.createdAt).format("DD/MM/YYYY")} | {decision.user.firstName + " " + decision.user.lastName} | {(isYou || user.admin) && <div className={homeStyles.deleteMessage} aria-label={translate["delete"]} role='button' title={translate["delete"]} onClick={() => removeDecision(decision.id)}><FontAwesomeIcon icon={faXmark} /></div>}
            </div>
            <div>
                <Typography variant='h6' className={homeStyles.meetingTitle}>{decision.title}</Typography>
            </div>

            <div className={homeStyles.reactContainer}>
                <div onClick={() => react(decision.id, true)} className={homeStyles.reactButton + " " + (userHasUpvoted ? homeStyles.reacted : "")} role='button' aria-label={translate["upvote"]} title={translate["upvote"]}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>{decision.meetingsDecisionsUpvotes.length}</span>
                </div>
                <div onClick={() => react(decision.id, false)} className={homeStyles.reactButton + " " + (userHasDownvoted ? homeStyles.reacted : "")} role='button' aria-label={translate["downvote"]} title={translate["downvote"]}>
                    <FontAwesomeIcon icon={faThumbsDown} />
                    <span>{decision.meetingsDecisionsDownvotes.length}</span>
                </div>
            </div>
        </div>
    )
}
