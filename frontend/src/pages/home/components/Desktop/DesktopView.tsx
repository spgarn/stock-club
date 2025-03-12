import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Currencies } from "../Currencies";
import PreviousMeetings from "../PreviousMeetings";
import Proposals from "../Proposals";
import UpcomingMeetings from "../UpcomingMeetings";
import { ClubDetails, CurrencyRate, Meeting, User } from "../../../../api";
import homeStyles from "../../home.module.scss";

type DesktopViewProps = {
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<ClubDetails, Error>>
    prevMeetings: Meeting[]
    currencies: CurrencyRate[] | undefined
    user: User
    upcomingMeetings: Meeting[]
    data: ClubDetails
}

export const DesktopView = ({ currencies, data, prevMeetings, refetch, upcomingMeetings, user }: DesktopViewProps) => {
    return (
        <div className={homeStyles.desktopView}>
            <div>
                <UpcomingMeetings user={user} refetch={refetch} upcomingMeetings={upcomingMeetings} />
                <PreviousMeetings user={user} refetch={refetch} prevMeetings={prevMeetings} />
            </div>
            <div>
                <Proposals user={user} refetch={refetch} meetingsSuggestions={data.meetingsSuggestions} />
                <Currencies currencies={currencies || []} />
            </div>

        </div>
    );
};
