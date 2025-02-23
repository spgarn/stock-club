import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
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
import useWindowDimensions from "../../hooks/useWindowDimensions";
import Wrapper from "./components/Wrapper";
import DOMPurify from 'dompurify';
import AddSuggestionModal from "../home/components/AddSuggestionModal";
const options = ['agenda', 'meeting_protocol', 'proposals', 'chat'];

export default function Meeting() {
    const [displayMethod, setDisplayMethod] = useState<"agenda" | "meeting_protocol" | "proposals" | "chat">("agenda");
    const { width } = useWindowDimensions();
    const isMobile = (width ?? 0) < 700;
    const [agenda, setAgenda] = useState("");
    const [addSuggestionOpen, setAddSuggestionOpen] = useState(false);
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
    }, [meeting]);

    const handleChange = (_event: unknown, value: string) => {
        if (value !== null) {
            setDisplayMethod(value as typeof displayMethod);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelectChange = (event: any) => {
        setDisplayMethod(event.target.value as typeof displayMethod);
    };
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
                    <Button onClick={() => setAddSuggestionOpen(true)}>{translate["new_proposal"]}</Button>
                    <Button onClick={() => setEditMeetingOpen(true)}>{translate["edit"]}</Button>

                    {meeting.endedAt ? <Button onClick={toggleMeeting} color="warning">{translate["reopen_meeting"]}</Button> : <Button onClick={toggleMeeting} color="error">{translate["end_meeting"]}</Button>}

                </div>
            </div>
            {isMobile ? <div className={meetingStyles.mobileView}>
                <div className={meetingStyles.toggleContainer}>

                    {(width ?? 0) < 450 ? <FormControl fullWidth size="small">
                        <Select
                            value={displayMethod}
                            onChange={handleSelectChange}
                            sx={{
                                minWidth: 120,
                                '& .MuiSelect-select': {
                                    py: 1
                                }
                            }}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {translate[option as keyof (typeof translate)]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> : <ToggleButtonGroup
                        size="small"
                        color="primary"
                        value={displayMethod}
                        exclusive
                        onChange={handleChange}
                        aria-label="Display Type"
                    >
                        {options.map((option) => (
                            <ToggleButton key={option} value={option}>
                                {translate[option as keyof (typeof translate)]}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>}
                </div>
                {displayMethod === "agenda" && <Wrapper title={translate["agenda"]}>
                    <TipTapEditor content={agenda} label={translate["agenda"]} onChange={sendAgenda} />
                </Wrapper>}
                {displayMethod === "meeting_protocol" && <Wrapper title={translate["meeting_protocols"]}>
                    <TipTapEditor content={meetingProtocols} label={translate["meeting_protocols"]} onChange={sendMeetingProtocol} />
                </Wrapper>}
                {displayMethod === "chat" && <Wrapper title={translate["chat"]}>
                    <Chats messages={chats} sendMessage={sendChat} user={user} removeMessage={removeMessage} />
                </Wrapper>}
                {displayMethod === "proposals" && <Wrapper title={translate["proposals"]}>
                    <Suggestions user={user} refetch={liveRefetch} meetingsSuggestions={clubDetails.meetingsSuggestions} />
                </Wrapper>}
            </div> : <div className={meetingStyles.desktopView}>
                <div className={meetingStyles.left}>
                    <Wrapper title={translate["agenda"]}>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(agenda) }} />

                    </Wrapper>
                    <Wrapper title={translate["meeting_protocols"]}>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(meetingProtocols) }} />

                    </Wrapper>
                </div>
                <div className={meetingStyles.right}>
                    <Wrapper title={translate["chat"]}>
                        <Chats messages={chats} sendMessage={sendChat} user={user} removeMessage={removeMessage} />
                    </Wrapper>
                    <Wrapper title={translate["proposals"]}>
                        <Suggestions user={user} refetch={liveRefetch} meetingsSuggestions={clubDetails.meetingsSuggestions} />
                    </Wrapper>
                </div>

            </div>}
            {editMeetingOpen && <EditMeetingModal refetch={liveRefetch} handleClose={() => setEditMeetingOpen(false)} meeting={meeting} />}
            {addSuggestionOpen && <AddSuggestionModal meetingId={meeting.id} clubId={clubId} refetch={refetchClubAndMeeting} handleClose={() => setAddSuggestionOpen(false)} />}
        </div>
    )
}
