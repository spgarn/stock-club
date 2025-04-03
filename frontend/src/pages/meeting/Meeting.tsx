import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import meetingStyles from "./meeting.module.scss";
import { translate, translateText } from "../../i18n";
import { useQuery } from "@tanstack/react-query";
import api, { getClubDetails, getMeeting, getUser, MeetingChat, MeetingDecisions, MeetingDecisionsBasic, User } from "../../api";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import Suggestions from "../home/components/Suggestions";
import dayjs from "dayjs";
import EditMeetingModal from "./components/EditMeetingModal";
import { useEffect, useRef, useState } from "react";
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
import { SubmitHandler } from "react-hook-form";
import { NewMeeting } from "../../components/ConfirmClub";
import AddDecisionModal from "./components/AddDecisionModal";
import Decisions from "./components/Decisions";
import DecisionVoteModal from "./components/DecisionVoteModal";
import DecisionVoteResultsModal from "./components/DecisionVoteResultsModal";
const options = ['agenda', 'meeting_protocol', 'proposals', 'chat'];
export type DecisionVoteResults = { decision: MeetingDecisions, upvotes: number; downvotes: number; };

const getReaction = (decision: MeetingDecisions | undefined, user: User) => {

}

export default function Meeting() {
    const [displayMethod, setDisplayMethod] = useState<"agenda" | "meeting_protocol" | "proposals" | "chat">("agenda");
    const { width } = useWindowDimensions();
    const isMobile = (width ?? 0) < 700;
    const [agenda, setAgenda] = useState("");
    const [isEditingAgenda, setIsEditingAgenda] = useState(false);
    const [isEditingProtocol, setIsEditingProtocol] = useState(false);
    const [addSuggestionOpen, setAddSuggestionOpen] = useState(false);
    const [addDecisionOpen, setAddDecisionOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [meetingProtocols, setMeetingProtocols] = useState("");
    const [activeDecision, setActiveDecision] = useState<null | MeetingDecisionsBasic>(null);
    const [decisionVoteResults, setDecisionVoteResults] = useState<null | DecisionVoteResults>(null);
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
    const setVoteResults = (v: { id: number; upvotes: number; downvotes: number; }) => {
        const decision = meeting?.meetingDecisions.find(m => m.id === v.id);
        if (decision) {
            setDecisionVoteResults({ decision, upvotes: v.upvotes, downvotes: v.downvotes })
        } else {
            console.log("No decision found")
        }

    }
    const { sendAgenda, sendMeetingProtocol, sendChat, removeMessage, liveRefetch } = useMeetingSocket(Number(id), clubId, getAgenda, getMeetingProtocol, getChat, removeChat, refetchClubAndMeeting, setActiveDecision, setVoteResults);

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

    const onSubmit: SubmitHandler<NewMeeting> = async (data: NewMeeting) => {
        if (!meeting) return
        try {
            const res = await api.put<unknown>
                ("/meeting/" + meeting.id, {
                    name: data.name,
                    description: data.description,
                    meetingTime: data.time,
                    location: data.location,
                    agenda: data.agenda,
                    meetingProtocol: data.meetingProtocols
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["meeting_edited_success"]);
            refetchClubAndMeeting();
            setIsEditingAgenda(false);
            setIsEditingProtocol(false);
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
    }


    const wrapperRefAgenda = useRef<HTMLDivElement>(null);
    const wrapperRefProtocol = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = async (event: MouseEvent) => {
            if (!meeting) return;
            let shouldSubmit = false;

            // Check for agenda changes
            if (
                isEditingAgenda &&
                wrapperRefAgenda.current &&
                !wrapperRefAgenda.current.contains(event.target as Node)
            ) {
                // Only submit if the new agenda is different from the original
                if (agenda !== meeting.agenda) {
                    shouldSubmit = true;
                }
                setIsEditingAgenda(false);
            }

            // Check for protocol changes
            if (
                isEditingProtocol &&
                wrapperRefProtocol.current &&
                !wrapperRefProtocol.current.contains(event.target as Node)
            ) {
                // Only submit if the new protocol is different from the original
                if (meetingProtocols !== meeting.meetingProtocol) {
                    shouldSubmit = true;
                }
                setIsEditingProtocol(false);
            }

            // Only submit if there was a change and if no submission is currently in progress
            if (shouldSubmit && !submitting) {
                setSubmitting(true);
                try {
                    await onSubmit({
                        agenda: agenda,
                        description: meeting.description,
                        location: meeting.location,
                        meetingProtocols: meetingProtocols,
                        name: meeting.name,
                        time: meeting.meetingTime,
                    });
                } finally {
                    setSubmitting(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [
        isEditingAgenda,
        isEditingProtocol,
        meeting,
        agenda,
        meetingProtocols,
        submitting,
    ]);


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
                    <Button onClick={() => setAddDecisionOpen(true)}>{translate["new_decision"]}</Button>

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
                <div className={meetingStyles.left} >
                    <Wrapper ref={wrapperRefAgenda} title={translate["agenda"]} onClick={() => setIsEditingAgenda(true)}>



                        {isEditingAgenda ?

                            <TipTapEditor content={agenda} label={translate["agenda"]} onChange={(text) => setAgenda(text)} />


                            :
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(agenda) }} />
                        }
                    </Wrapper>
                    <Wrapper ref={wrapperRefProtocol} title={translate["meeting_protocols"]} onClick={() => setIsEditingProtocol(true)}>
                        {
                            isEditingProtocol ?
                                <TipTapEditor content={meetingProtocols} label={translate["meeting_protocols"]} onChange={(text) => setMeetingProtocols(text)} />

                                :

                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(meetingProtocols) }} />
                        }

                    </Wrapper>
                </div>
                <div className={meetingStyles.right}>
                    <Wrapper title={translate["chat"]}>
                        <Chats messages={chats} sendMessage={sendChat} user={user} removeMessage={removeMessage} />
                    </Wrapper>
                    <Wrapper title={translate["proposals"]}>
                        <Suggestions user={user} refetch={liveRefetch} meetingsSuggestions={clubDetails.meetingsSuggestions} />
                    </Wrapper>
                    <Wrapper title={translate["decisions"]}>
                        <Decisions user={user} refetch={liveRefetch} meetingsDecisions={meeting.meetingDecisions} openModal={(v) => setActiveDecision(v)} />
                    </Wrapper>
                </div>

            </div>}
            {editMeetingOpen && <EditMeetingModal refetch={liveRefetch} handleClose={() => setEditMeetingOpen(false)} meeting={meeting} />}
            {addSuggestionOpen && <AddSuggestionModal meetingId={meeting.id} clubId={clubId} refetch={refetchClubAndMeeting} handleClose={() => setAddSuggestionOpen(false)} />}
            {addDecisionOpen && <AddDecisionModal meetingId={meeting.id} clubId={clubId} refetch={refetchClubAndMeeting} handleClose={() => setAddDecisionOpen(false)} />}
            {!!activeDecision && <DecisionVoteModal meetingId={meeting.id} clubId={clubId} handleClose={() => setActiveDecision(null)} decision={activeDecision} refetch={refetchClubAndMeeting} reaction={getReaction(meeting.meetingDecisions.find(d => d.id == activeDecision.id), user)} />}
            {!!decisionVoteResults && <DecisionVoteResultsModal results={decisionVoteResults} handleClose={() => setActiveDecision(null)} />}

        </div>
    )
}
