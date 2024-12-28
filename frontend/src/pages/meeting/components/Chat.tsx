
import dayjs from 'dayjs';
import { MeetingChat, User } from '../../../api'
import meetingStyles from "../meeting.module.scss";
import { translate } from '../../../i18n';
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function Chat({ message, user, removeMessage }: { message: MeetingChat, user: User, removeMessage: (id: number) => void }) {
    const isYou = user.email === message.user.email;
    return (
        <div className={meetingStyles.message + " " + (isYou ? meetingStyles.me : "")}>
            <div className={meetingStyles.messageHeader}>
                {isYou ? <p>{translate["you"]}</p> : <p>{message.user.firstName} {message.user.lastName}</p>}

                <div>{dayjs(message.updatedAt).format("HH:mm:ss MM/DD")} {(isYou || user.admin) && <div className={meetingStyles.deleteMessage} aria-label={translate["delete"]} role='button' title={translate["delete"]} onClick={() => removeMessage(message.id)}><FontAwesomeIcon icon={faXmark} /></div>}</div>
            </div>
            <p className={meetingStyles.messageContent}>{message.message}</p>
        </div>
    )
}
