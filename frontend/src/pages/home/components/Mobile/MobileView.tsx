import { colors, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { translate } from "../../../../i18n";
import homeStyles from "../../home.module.scss";
import { formatCurrency } from "../../../../funcs/funcs";
import UpcomingMeetings from "../../components/UpcomingMeetings";
import PreviousMeetings from "../../components/PreviousMeetings";
import Proposals from "../../components/Proposals";
import { useState } from "react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ClubDetails, CurrencyRate, Meeting, User } from "../../../../api";

type MobileViewProps = {
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<ClubDetails, Error>>
    prevMeetings: Meeting[]
    currencies: CurrencyRate[] | undefined
    user: User
    upcomingMeetings: Meeting[]
    data: ClubDetails
}

export const MobileView = ({ refetch, data, prevMeetings, currencies, upcomingMeetings, user }: MobileViewProps) => {
    const [displayMethod, setDisplayMethod] = useState<"prev_meetings" | "proposals" | "info">("prev_meetings");
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
        </div>
    );
};
