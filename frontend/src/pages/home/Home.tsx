import { Button, colors, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { translate } from "../../i18n";
import homeStyles from "./home.module.scss";
import { getClubDetails, getCurrencyRates, getUser } from "../../api";
import {
    useQuery,
} from '@tanstack/react-query'
import { useMemo, useState } from "react";
import Loading from "../../components/Loading";
import AddMeetingModal from "./components/AddMeetingModal";
import dayjs from "dayjs";
import { formatCurrency, refetchClubAndMeeting } from "../../funcs/funcs";
import useClubs from "../../hooks/useClubs";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import UpcomingMeetings from "./components/UpcomingMeetings";
import PreviousMeetings from "./components/PreviousMeetings";
import Proposals from "./components/Proposals";

export default function Home() {


    const { clubId: id, clubs: clubData } = useClubs();
    const [addMeetingOpen, setAddMeetingOpen] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = (width ?? 0) < 700;
    const [displayMethod, setDisplayMethod] = useState<"prev_meetings" | "proposals" | "info">("prev_meetings");
    //This is for mobile view, if false, show proposals
    const { data, refetch } = useQuery({
        queryKey: ['club-details', id],
        queryFn: () => getClubDetails(id),
    });

    const { data: currencies } = useQuery({
        queryKey: ["currency"],
        queryFn: getCurrencyRates,
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
            </div>
            {isMobile ? <div className={homeStyles.mobileView}>
                <UpcomingMeetings refetch={refetch} user={user} upcomingMeetings={upcomingMeetings} />
                <div className={homeStyles.toggleContainer}>
                    <ToggleButtonGroup
                        color="primary"
                        value={displayMethod}
                        exclusive
                        onChange={(_v, r) => setDisplayMethod(r)}
                        aria-label="Display Type"
                    >
                        <ToggleButton value="prev_meetings">{translate["previous_meetings"]}</ToggleButton>
                        <ToggleButton value="proposals">{translate["proposals"]}</ToggleButton>
                        <ToggleButton value="info">{translate["info"]}</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {displayMethod === "prev_meetings" ? <PreviousMeetings refetch={refetch} user={user} prevMeetings={prevMeetings} /> :
                    displayMethod === "info" ?
                        <>
                            <Typography variant="h5">{translate["currency"]}</Typography>
                            <div className={"content-box"}>

                                {currencies?.filter(currency => currency.name !== "SEK").map(currency => <div key={currency.id} style={{ display: "flex", gap: "10px", padding: "12px" }}>
                                    <span style={{ color: colors.blueGrey["400"] }}>{currency.name}:</span>
                                    <span>{formatCurrency(currency.rate)}</span>
                                </div>)}
                            </div>
                            </>
                        : <Proposals user={user} refetch={refetch} meetingsSuggestions={data.meetingsSuggestions} />}
            </div> : <div className={homeStyles.desktopView}>
                <div>
                    <UpcomingMeetings user={user} refetch={refetch} upcomingMeetings={upcomingMeetings} />
                    <PreviousMeetings user={user} refetch={refetch} prevMeetings={prevMeetings} />
                </div>
                <div>
                    <Proposals user={user} refetch={refetch} meetingsSuggestions={data.meetingsSuggestions} clubId={id} />
                    <div className={"content-box"}>
                        {currencies?.filter(currency => currency.name !== "SEK").map(currency => <div key={currency.id} style={{ display: "flex", gap: "10px", padding: "12px" }}>
                            <span style={{ color: colors.blueGrey["400"] }}>{currency.name}:</span>
                            <span>{formatCurrency(currency.rate)}</span>
                        </div>)}

                    </div>
                </div>

            </div>}

            {addMeetingOpen && <AddMeetingModal clubId={id} refetch={refetchClubAndMeeting} handleClose={() => setAddMeetingOpen(false)} />}
        </div>
    )
}
