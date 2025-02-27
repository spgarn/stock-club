import api, { Meeting, User } from '../../../api'
import dayjs from "dayjs";
import homeStyles from "../home.module.scss";
import { Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons/faThumbsDown';
import { translate, translateText } from '../../../i18n';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function MeetingBox({ meeting, user, refetch }: { meeting: Meeting, refetch: () => void, user: User }) {
    const time = dayjs(meeting.meetingTime);

    const [isUpvoting, setIsUpvoting] = useState(false);
    const respond = async (isAttending: boolean) => {
        if (isUpvoting) return;

        setIsUpvoting(true);
        try {
            const res = await api.post<unknown>
                (`/meeting/${meeting.id}/respond`, {
                    isAttending
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            refetch();
            console.log(resData);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data) {
                    toast.error(translateText(err.response?.data?.title, err.response?.data?.title));
                } else {
                    toast.error(err.message);
                }
            } else {
                toast.error(translate["something_went_wrong"])
            }
        }
        setIsUpvoting(false);
    }
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
            <div className={homeStyles.attendanceMeetingWrapper}>

                <Typography variant="body1" className={homeStyles.meetingTitle}>{translate["attend"] + "?"}</Typography>
                <div className={homeStyles.attendanceMeeting}>
                    <FontAwesomeIcon className={homeStyles.attendanceVoteIcon} icon={faThumbsUp} onClick={(e) => {
                        e.preventDefault()
                        respond(true)
                    }
                    } />
                    <FontAwesomeIcon className={homeStyles.attendanceVoteIcon} icon={faThumbsDown} onClick={(e) => {
                        e.preventDefault()
                        respond(false)
                    }} />
                </div>
            </div>


        </NavLink>
    )
}
