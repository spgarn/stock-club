import { Meeting } from '../../../api'
import dayjs from "dayjs";
import homeStyles from "../home.module.scss";
import { Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function MeetingBox({ meeting }: { meeting: Meeting }) {
    console.log(meeting);
    const time = dayjs(meeting.meetingTime);
    return (
        <NavLink to={"/club/meeting/" + meeting.id} className={homeStyles.meeting}>
            <div className={homeStyles.meetingLeft}>
                <Typography variant='h6' className={homeStyles.meetingTitle}>{time.format("DD/MM/YYYY")}</Typography>
                <p>{time.format("HH:mm")}</p>
            </div>
            <div className={homeStyles.meetingRight}>
                <Typography variant='h6' className={homeStyles.meetingTitle}>{meeting.name}</Typography>
                <p>{meeting.location}</p>
            </div>

        </NavLink>
    )
}
