import { Meeting } from '../../../api'
import Typography from '@mui/material/Typography'
import { translate } from '../../../i18n'
import MeetingBox from './MeetingBox'

export default function UpcomingMeetings({ upcomingMeetings }: { upcomingMeetings: Meeting[] }) {
    return (
        <div>
            <Typography variant="h5">{translate["upcoming_meetings"]}</Typography>
            <div className="content-box">
                {upcomingMeetings.map((meeting, index) => <MeetingBox key={index} meeting={meeting} />)}
            </div>
        </div>
    )
}
