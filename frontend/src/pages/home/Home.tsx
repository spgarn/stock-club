import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { translate } from "../../i18n";
import homeStyles from "./home.module.scss";
import { getClubDetails, getUser } from "../../api";
import {
    useQuery,
} from '@tanstack/react-query'
import { useMemo, useState } from "react";
import AddSuggestionModal from "./components/AddSuggestionModal";
import Loading from "../../components/Loading";
import AddMeetingModal from "./components/AddMeetingModal";
import dayjs from "dayjs";
import { refetchClubAndMeeting } from "../../funcs/funcs";
import useClubs from "../../hooks/useClubs";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import UpcomingMeetings from "./components/UpcomingMeetings";
import PreviousMeetings from "./components/PreviousMeetings";
import Proposals from "./components/Proposals";

export default function Home() {

    // useEffect(() => {
    //     api.get("/emails")
    //       .then(response => {
    //         console.log(response.data);
    //       })
    //       .catch(error => {
    //         console.error("Error fetching emails:", error);
    //       });
    //   }, []);


    const { clubId: id, clubs: clubData } = useClubs();
    const [addSuggestionOpen, setAddSuggestionOpen] = useState(false);
    const [addMeetingOpen, setAddMeetingOpen] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = (width ?? 0) < 700;
    const [displayMethod, setDisplayMethod] = useState<"prev_meetings" | "proposals">("prev_meetings");
    //This is for mobile view, if false, show proposals
    const { data, refetch } = useQuery({
        queryKey: ['club-details', id],
        queryFn: () => getClubDetails(id),
    });

    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
    });
    const { upcomingMeetings, prevMeetings } = useMemo(() => {
        if (!data?.meetings) {
            return { upcomingMeetings: [], prevMeetings: [] }
        }
        const meetings = data.meetings;
        return {
            upcomingMeetings: meetings.filter(meeting => dayjs(meeting.meetingTime).isAfter(dayjs())),
            prevMeetings: meetings.filter(meeting => dayjs(meeting.meetingTime).isBefore(dayjs()) || dayjs(meeting.meetingTime).isSame(dayjs()))
        }
    }, [data?.meetings]);

    if (!clubData || !data || !user) {
        return <Loading />
    }

    return (
        <div>
            <div className={homeStyles.actions}>
                <Button variant="contained" onClick={() => setAddMeetingOpen(true)}>{translate["new_meeting"]}</Button>
                <Button variant="contained" onClick={() => setAddSuggestionOpen(true)}>{translate["new_proposal"]}</Button>
            </div>
            {isMobile ? <div className={homeStyles.mobileView}>
                <UpcomingMeetings upcomingMeetings={upcomingMeetings} />
                <div className={homeStyles.toggleContainer}>
                    <ToggleButtonGroup
                        color="primary"
                        value={displayMethod}
                        exclusive
                        onChange={(_v, r) => setDisplayMethod(r)}
                        aria-label="Display Type"
                    >
                        <ToggleButton value="prev_meetings">{translate["upcoming_meetings"]}</ToggleButton>
                        <ToggleButton value="proposals">{translate["proposals"]}</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {displayMethod == "prev_meetings" ? <PreviousMeetings prevMeetings={prevMeetings} /> : <Proposals user={user} refetch={refetch} meetingsSuggestions={data.meetingsSuggestions} />}
            </div> : <div className={homeStyles.desktopView}>
                <div>
                    <UpcomingMeetings upcomingMeetings={upcomingMeetings} />
                    <PreviousMeetings prevMeetings={prevMeetings} />
                </div>
                <div>
                    <Proposals user={user} refetch={refetch} meetingsSuggestions={data.meetingsSuggestions} />
                </div>
            </div>}

            {addSuggestionOpen && <AddSuggestionModal clubId={id} refetch={refetchClubAndMeeting} handleClose={() => setAddSuggestionOpen(false)} />}
            {addMeetingOpen && <AddMeetingModal clubId={id} refetch={refetchClubAndMeeting} handleClose={() => setAddMeetingOpen(false)} />}
        </div>
    )
}
