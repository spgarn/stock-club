import { Button } from "@mui/material";
import { translate } from "../../i18n";
import homeStyles from "./home.module.scss";
import { getClubDetails, getCurrencyRates, getStocks, getUser } from "../../api";
import {
    useQuery,
} from '@tanstack/react-query'
import { useMemo, useState } from "react";
import Loading from "../../components/Loading";
import AddMeetingModal from "./components/AddMeetingModal";
import dayjs from "dayjs";
import { refetchClubAndMeeting } from "../../funcs/funcs";
import useClubs from "../../hooks/useClubs";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { MobileView } from "./components/Mobile/MobileView";
import { DesktopView } from "./components/Desktop/DesktopView";

export default function Home() {


    const { clubId: id, clubs: clubData } = useClubs();
    const [addMeetingOpen, setAddMeetingOpen] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = (width ?? 0) < 700;

    //This is for mobile view, if false, show proposals
    const { data, refetch } = useQuery({
        queryKey: ['club-details', id],
        queryFn: () => getClubDetails(id),
    });

    const { data: currencies } = useQuery({
        queryKey: ["currency"],
        queryFn: getCurrencyRates,
    });

    const { data: stocks } = useQuery({
        queryKey: ["stocksHome"],
        queryFn: () => getStocks(id),
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
            {isMobile ? <MobileView stocks={stocks?.filter(stocks => !stocks.sold) ?? []} data={data} prevMeetings={prevMeetings} currencies={currencies} user={user} upcomingMeetings={upcomingMeetings} refetch={refetch} />
                : <DesktopView stocks={stocks?.filter(stocks => !stocks.sold) ?? []} data={data} prevMeetings={prevMeetings} currencies={currencies} user={user} upcomingMeetings={upcomingMeetings} refetch={refetch} />}

            {addMeetingOpen && <AddMeetingModal clubId={id} refetch={refetchClubAndMeeting} handleClose={() => setAddMeetingOpen(false)} />}
        </div>
    )
}
