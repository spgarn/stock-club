import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Currencies } from "../Currencies";
import PreviousMeetings from "../PreviousMeetings";
import UpcomingMeetings from "../UpcomingMeetings";
import { ClubDetails, CurrencyRate, Meeting, StockHoldings, User } from "../../../../api";
import homeStyles from "../../home.module.scss";
import { StockPerformance } from "../StockPerformance";
import Typography from "@mui/material/Typography";
import { translate } from "../../../../i18n";

type DesktopViewProps = {
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<ClubDetails, Error>>
    prevMeetings: Meeting[]
    currencies: CurrencyRate[] | undefined
    user: User
    upcomingMeetings: Meeting[]
    data: ClubDetails
    stocks: StockHoldings[]
}

export const DesktopView = ({ currencies, prevMeetings, refetch, upcomingMeetings, user, stocks }: DesktopViewProps) => {
    return (
        <div className={homeStyles.desktopView}>
            <div>
                <UpcomingMeetings user={user} refetch={refetch} upcomingMeetings={upcomingMeetings} />
                <PreviousMeetings user={user} refetch={refetch} prevMeetings={prevMeetings} />
            </div>
            <div>
                <Typography variant="h5">{translate["info"]}</Typography>
                <div className="meeting-cards" >
                    <StockPerformance currencies={currencies || []} stocks={stocks || []} />
                    <Currencies currencies={currencies || []} />
                </div>
            </div>

        </div>
    );
};
