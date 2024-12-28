import Typography from "@mui/material/Typography";
import { MeetingSuggestion, User } from "../../../api";
import Suggestions from "./Suggestions";
import { translate } from "../../../i18n";

export default function Proposals({ user, refetch, meetingsSuggestions }: { user: User, refetch: () => void, meetingsSuggestions: MeetingSuggestion[] }) {
    return (
        <div>
            <Typography variant="h5">{translate["proposals"]}</Typography>
            <Suggestions user={user} refetch={refetch} meetingsSuggestions={meetingsSuggestions} />
        </div>
    )
}
