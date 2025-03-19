import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { translate } from "../../../../i18n";
import homeStyles from "../../home.module.scss";
import UpcomingMeetings from "../../components/UpcomingMeetings";
import PreviousMeetings from "../../components/PreviousMeetings";
import Proposals from "../../components/Proposals";
import { useState } from "react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ClubDetails, CurrencyRate, Meeting, StockHoldings, User } from "../../../../api";
import { Currencies } from "../Currencies";
import { StockPerformance } from "../StockPerformance";

type MobileViewProps = {
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<ClubDetails, Error>>
    prevMeetings: Meeting[]
    currencies: CurrencyRate[] | undefined
    user: User
    upcomingMeetings: Meeting[]
    data: ClubDetails
    stocks: StockHoldings[]
}

export const MobileView = ({ refetch, data, prevMeetings, currencies, upcomingMeetings, user, stocks }: MobileViewProps) => {
    const [displayMethod, setDisplayMethod] = useState<"prev_meetings" | "proposals" | "info">("info");
    return (
        <div className={homeStyles.mobileView}>
            <UpcomingMeetings refetch={refetch} user={user} upcomingMeetings={upcomingMeetings} />
            <div className={homeStyles.toggleContainer}>
                <ToggleButtonGroup
                    color="primary"
                    value={displayMethod}
                    exclusive
                    onChange={(_v, r) => setDisplayMethod(r)}
                    aria-label="Display Type"
                >
                    <ToggleButton value="info">{translate["info"]}</ToggleButton>
                    <ToggleButton value="proposals">{translate["proposals"]}</ToggleButton>
                    <ToggleButton value="prev_meetings">{translate["previous_meetings"]}</ToggleButton>
                </ToggleButtonGroup>
            </div>
            {displayMethod === "prev_meetings" ? <PreviousMeetings refetch={refetch} user={user} prevMeetings={prevMeetings} /> :
                displayMethod === "info" ?
                    <div className="meeting-cards" >
                        <StockPerformance stocks={stocks || []} />
                        <Currencies currencies={currencies || []} />
                    </div>
                    : <Proposals user={user} refetch={refetch} meetingsSuggestions={data.meetingsSuggestions} />}
        </div>
    );
};
