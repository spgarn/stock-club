import { useEffect, useRef } from 'react'
import { MeetingChat, User } from '../../../api'
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { blue, grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { translate } from '../../../i18n';
import meetingStyles from "../meeting.module.scss";
import Chat from './Chat';

export default function Chats({ messages, sendMessage, user, removeMessage }: { messages: MeetingChat[], sendMessage: (v: string) => void; user: User, removeMessage: (v: number) => void }) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight; // Scroll within the container
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Runs whenever `messages` changes

    const send = () => {
        if (textareaRef.current) {
            sendMessage(textareaRef.current.value);
            textareaRef.current.value = '';
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            textareaRef.current?.blur();
            send();
        }
    };
    const Textarea = styled(TextareaAutosize)(
        ({ theme }) => `
        box-sizing: border-box;
        width: 320px;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5;
        padding: 12px;
        border-radius: 12px 12px 0;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
        box-shadow: 0 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    
        &:hover {
          border-color: ${blue[400]};
        }
    
        &:focus {
          outline: 0;
          border-color: ${blue[400]};
          box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
        }
    
        /* firefox */
        &:focus-visible {
          outline: 0;
        }
      `,
    );
    return (
        <div className={meetingStyles.messageContainer}>
            {messages.length === 0 && <p className='text-center p-1'>{translate["no_chats"]}</p>}
            <div className={meetingStyles.messages} ref={containerRef}>
                {messages.map(message => <Chat key={message.id} message={message} user={user} removeMessage={removeMessage} />)}
            </div>
            <div className={meetingStyles.replyContainer}>
                <Textarea sx={{
                    minHeight: 45, maxHeight: 150, resize: "vertical", overflow: "auto",
                }} key="new-message" aria-label={translate["enter_message"]} placeholder={translate["enter_message"]} ref={textareaRef} onKeyDown={handleKeyDown} />
                <div className={meetingStyles.reply} role='button' aria-label={translate["reply"]} title={translate["reply"]} onClick={send}>
                    <FontAwesomeIcon icon={faReply} />
                </div>
            </div>
        </div>
    )
}
