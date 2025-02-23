import { MeetingSuggestion, User } from '../../../api'
import dayjs from "dayjs";
import homeStyles from "../home.module.scss";
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown } from "@fortawesome/free-regular-svg-icons/faThumbsDown";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons/faThumbsUp";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons/faCheckCircle";
import { translate } from '../../../i18n';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
export default function Suggestion({ user, suggestion, react, removeSuggestion, toggleActive }: { user: User, suggestion: MeetingSuggestion; react: (meetingId: number, isUpvote: boolean) => void; removeSuggestion: (meetingId: number) => void, toggleActive: (id: number) => void }) {
    const userHasUpvoted = suggestion.meetingsSuggestionsUpvotes.find(upvote => upvote.userId === user.id);
    const userHasDownvoted = suggestion.meetingsSuggestionsDownvotes.find(upvote => upvote.userId === user.id);
    const isYou = user.email === suggestion.user.email;

    return (
        <div className={`${homeStyles.suggestion} suggestion-card` }>
            <div className={homeStyles.suggestionHeader}>{dayjs(suggestion.createdAt).format("DD/MM/YYYY")} | {suggestion.user.firstName + " " + suggestion.user.lastName} | {(isYou || user.admin) && <div className={homeStyles.deleteMessage} aria-label={translate["delete"]} role='button' title={translate["delete"]} onClick={() => removeSuggestion(suggestion.id)}><FontAwesomeIcon icon={faXmark} /></div>}                 <FontAwesomeIcon className='clickable' icon={faCheckCircle} onClick={() => toggleActive(suggestion.id)} />
            </div>
            <div>
                <Typography variant='h6' className={homeStyles.meetingTitle}>{suggestion.title}</Typography>
            </div>
            <div>
                <p>{suggestion.description}</p>
            </div>
            <div className={homeStyles.reactContainer}>
                <div onClick={() => react(suggestion.id, true)} className={homeStyles.reactButton + " " + (userHasUpvoted ? homeStyles.reacted : "")} role='button' aria-label={translate["upvote"]} title={translate["upvote"]}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>{suggestion.meetingsSuggestionsUpvotes.length}</span>
                </div>
                <div onClick={() => react(suggestion.id, false)} className={homeStyles.reactButton + " " + (userHasDownvoted ? homeStyles.reacted : "")} role='button' aria-label={translate["downvote"]} title={translate["downvote"]}>
                    <FontAwesomeIcon icon={faThumbsDown} />
                    <span>{suggestion.meetingsSuggestionsDownvotes.length}</span>
                </div>
            </div>
        </div>
    )
}
