import { Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import meetingStyles from "./meeting.module.scss";
import { translate } from "../../i18n";
import { useQuery } from "@tanstack/react-query";
import api, { getClubDetails, getMeeting, getUser, MeetingChat } from "../../api";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import Suggestions from "../home/components/Suggestions";
import dayjs from "dayjs";
import EditMeetingModal from "./components/EditMeetingModal";
import { useEffect, useState } from "react";
import { refetchClubAndMeeting } from "../../funcs/funcs";
import TipTapEditor from "../../components/TipTapEditor";
import useMeetingSocket from "../../hooks/useMeetingSocket";
import useClubs from "../../hooks/useClubs";
import Chats from "./components/Chats";
import axios from "axios";
import { toast } from "react-toastify";

export default function Meeting() {
    const [agenda, setAgenda] = useState("");
    const [meetingProtocols, setMeetingProtocols] = useState("");
    const [chats, setChats] = useState<MeetingChat[]>([]);
    const { id } = useParams();
    const getAgenda = (message: string) => {
        if (agenda != message) {
            setAgenda(message);
        }
    };
    const getMeetingProtocol = (message: string) => {
        if (meetingProtocols != message) {
            setMeetingProtocols(message);
        }
    }
    const getChat = (chat: MeetingChat) => {
        console.log(chat);

        //Convert the list to map with unique ids, then add the new chat then convert back to array
        setChats((list) => {
            const chatMap = new Map(list.map(c => [c.id, c]));
            chatMap.set(chat.id, chat);
            return Array.from(chatMap.values());
        });
    };
    const removeChat = (id: number) => {

        //Convert the list to map with unique ids, then add the new chat then convert back to array
        setChats((list) => {
            const chatMap = new Map(list.map(c => [c.id, c]));
            chatMap.delete(id);
            return Array.from(chatMap.values());
        });
    };

    const { clubs: clubData, clubId } = useClubs();
    const [editMeetingOpen, setEditMeetingOpen] = useState(false);

    const { data: clubDetails } = useQuery({
        queryKey: ['club-details', clubId],
        queryFn: () => getClubDetails(clubId),
    });
    const { data: meeting } = useQuery({
        queryKey: ['club-meeting', id],
        queryFn: () => getMeeting(Number(id)),
    });
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
    });
    const { sendAgenda, sendMeetingProtocol, sendChat, removeMessage, liveRefetch } = useMeetingSocket(Number(id), clubId, getAgenda, getMeetingProtocol, getChat, removeChat, refetchClubAndMeeting);

    const toggleMeeting = async () => {
        try {
            const res = await api.put<unknown>
                ("/meeting/toggle/" + meeting?.id, {}, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            liveRefetch(); //This is connected to socket ensuring all connected devices refetch
            console.log(resData);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data) {
                    toast.error(err.response?.data?.title);
                } else {
                    toast.error(err.message);
                }
            } else {
                toast.error(translate["something_went_wrong"])
            }
        }
    }

    useEffect(() => {
        if (meeting) {
            setAgenda(meeting.agenda);
            setMeetingProtocols(meeting.meetingProtocol);
            setChats(meeting.meetingChats);
        }
    }, [meeting])
    if (!id) {
        return <div>
            <ErrorMessage error="Not Found" />
        </div>
    }
    if (!clubData || !meeting || !clubDetails || !user) {
        return <Loading />
    }
    return (
        <div>
            <div className="content-header">
                <Typography variant="h5">{meeting.name} - {dayjs(meeting.meetingTime).format("HH:mm DD/MM YY")}</Typography>
                <div className="flex">
                    <Button onClick={() => setEditMeetingOpen(true)}>{translate["edit"]}</Button>

                    {meeting.endedAt ? <Button onClick={toggleMeeting} color="warning">{translate["reopen_meeting"]}</Button> : <Button onClick={toggleMeeting} color="error">{translate["end_meeting"]}</Button>}

                </div>
            </div>
            <div className={meetingStyles.meeting}>
                <div className={meetingStyles.left}>
                    <div className={meetingStyles.wrapper}>
                        <Typography variant="h5">{translate["agenda"]}</Typography>
                        <div className="content-box">
                            <TipTapEditor content={agenda} label={translate["agenda"]} onChange={sendAgenda} />

                        </div>
                    </div>
                    <div className={meetingStyles.wrapper}>
                        <Typography variant="h5">{translate["meeting_protocols"]}</Typography>
                        <div className="content-box">
                            <TipTapEditor content={meetingProtocols} label={translate["meeting_protocols"]} onChange={sendMeetingProtocol} />
                        </div>
                    </div>

                </div>
                <div className={meetingStyles.right}>
                    <div className={meetingStyles.wrapper}>
                        <Typography variant="h5">{translate["chat"]}</Typography>
                        <div className="content-box">
                            <Chats messages={chats} sendMessage={sendChat} user={user} removeMessage={removeMessage} />
                        </div>
                    </div>
                    <div className={meetingStyles.wrapper}>
                        <Typography variant="h5">{translate["proposals"]}</Typography>
                        <Suggestions user={user} refetch={liveRefetch} meetingsSuggestions={clubDetails.meetingsSuggestions} />
                    </div>
                </div>

            </div>
            {editMeetingOpen && <EditMeetingModal refetch={liveRefetch} handleClose={() => setEditMeetingOpen(false)} meeting={meeting} />}

        </div>
    )
}
