import { Meeting } from '../../../api'
import Typography from '@mui/material/Typography'
import { translate } from '../../../i18n'
import MeetingBox from './MeetingBox'

export default function PreviousMeetings({ prevMeetings }: { prevMeetings: Meeting[] }) {
    return (
        <div>
            <Typography variant="h5">{translate["previous_meetings"]}</Typography>
            <div className="content-box">
                {prevMeetings.map((meeting, index) => <MeetingBox key={index} meeting={meeting} />)}
            </div>
        </div>
    )
}
