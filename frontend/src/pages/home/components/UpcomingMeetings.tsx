import { Meeting, User } from '../../../api'
import Typography from '@mui/material/Typography'
import { translate } from '../../../i18n'
import MeetingBox from './MeetingBox'

export default function UpcomingMeetings({ upcomingMeetings, user, refetch }: { upcomingMeetings: Meeting[], user: User, refetch: () => void }) {
    return (
        <div>
            <Typography variant="h5">{translate["upcoming_meetings"]}</Typography>
            <div className="content-box">
                {upcomingMeetings.map((meeting, index) => <MeetingBox key={index} meeting={meeting} refetch={refetch} user={user} />)}
            </div>
        </div>
    )
}
