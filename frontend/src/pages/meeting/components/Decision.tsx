import { MeetingDecisions, User } from '../../../api'
import dayjs from "dayjs";
import homeStyles from "../../home/home.module.scss";
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown } from "@fortawesome/free-regular-svg-icons/faThumbsDown";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons/faThumbsUp";
import { translate } from '../../../i18n';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { VoteInProgress } from './VoteInProgress';
export default function Decision({ user, decision, removeDecision, openModal }: { user: User, decision: MeetingDecisions; removeDecision: (meetingId: number) => void, openModal: (v: MeetingDecisions) => void }) {
    const userHasUpvoted = decision.meetingsDecisionsUpvotes.find(upvote => upvote.userId === user.id);
    const userHasDownvoted = decision.meetingsDecisionsDownvotes.find(downvote => downvote.userId === user.id);
    const isYou = user.email === decision.user.email;
    const expired = decision.expiresAt < new Date(Date.now());
    return (
        <div className={`${homeStyles.suggestion} suggestion-card`}>
            <div className={homeStyles.suggestionHeader}>{dayjs(decision.createdAt).format("DD/MM/YYYY")} | {decision.user.firstName + " " + decision.user.lastName} | {(isYou || user.admin) && <div className={homeStyles.deleteMessage} aria-label={translate["delete"]} role='button' title={translate["delete"]} onClick={() => removeDecision(decision.id)}><FontAwesomeIcon icon={faXmark} /></div>}
            </div>
            <div>
                <Typography variant='h6' className={homeStyles.meetingTitle}>{decision.title}</Typography>
            </div>

            {expired ? <div className={homeStyles.reactContainer}>
                <div className={homeStyles.lockedReact + " " + (userHasUpvoted ? homeStyles.reacted : "")} aria-label={translate["upvote"]} title={translate["upvote"]}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>{decision.meetingsDecisionsUpvotes.length}</span>
                </div>
                <div className={homeStyles.lockedReact + " " + (userHasDownvoted ? homeStyles.reacted : "")} aria-label={translate["downvote"]} title={translate["downvote"]}>
                    <FontAwesomeIcon icon={faThumbsDown} />
                    <span>{decision.meetingsDecisionsDownvotes.length}</span>
                </div>
            </div> : <VoteInProgress decision={decision} onClick={() => {
                openModal(decision);
            }} />
            }
        </div>
    )
}
