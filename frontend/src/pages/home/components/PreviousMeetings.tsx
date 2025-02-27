import { Meeting, User } from '../../../api'
import Typography from '@mui/material/Typography'
import { translate } from '../../../i18n'
import MeetingBox from './MeetingBox'

export default function PreviousMeetings({ prevMeetings, user, refetch }: { prevMeetings: Meeting[], user: User, refetch: () => void }) {
    return (
        <div>
            <Typography variant="h5">{translate["previous_meetings"]}</Typography>
            <div className="content-box">
                {prevMeetings.map((meeting, index) => <MeetingBox key={index} meeting={meeting} refetch={refetch} user={user} />)}
            </div>
        </div>
    )
}
