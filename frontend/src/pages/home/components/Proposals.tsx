import Typography from "@mui/material/Typography";
import { MeetingSuggestion, User } from "../../../api";
import Suggestions from "./Suggestions";
import { translate } from "../../../i18n";
import { useState } from "react";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

export default function Proposals({ user, refetch, meetingsSuggestions }: { user: User, refetch: () => void, meetingsSuggestions: MeetingSuggestion[] }) {
    const [displayMethod, setDisplayMethod] = useState<"new" | "old">("new");
    return (
        <div>
            <div className="content-header">
                <Typography variant="h5">{translate["proposals"]}</Typography>
                <ToggleButtonGroup
                    color="primary"
                    value={displayMethod}
                    exclusive
                    onChange={(_v, r) => setDisplayMethod(r)}
                    aria-label="Display Type"
                    size="small"
                >
                    <ToggleButton size="small" value="new">{translate["new"]}</ToggleButton>
                    <ToggleButton size="small" value="old">{translate["old"]}</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <Suggestions user={user} refetch={refetch} meetingsSuggestions={displayMethod === "old" ? meetingsSuggestions.filter(sugg => sugg.completed) : meetingsSuggestions.filter(sugg => !sugg.completed)} />
        </div>
    )
}
