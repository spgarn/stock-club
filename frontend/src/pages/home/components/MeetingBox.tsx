import api, { Meeting, User } from '../../../api'
import dayjs from "dayjs";
import homeStyles from "../home.module.scss";
import { Autocomplete, Button, colors, Dialog, DialogContent, TextField, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons/faThumbsDown';
import { translate, translateText } from '../../../i18n';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AddToCalendarButton } from 'add-to-calendar-button-react';

export default function MeetingBox({ meeting, user, refetch }: { meeting: Meeting, refetch: () => void, user: User }) {

    const time = dayjs(meeting.meetingTime);
    const now = dayjs();
    const [isUpvoting, setIsUpvoting] = useState(false);
    const [isDownvoting, setIsDownvoting] = useState(false);
    const [downvotingUser, setDownvotingUser] = useState<User | null>(null);

    const [attendance, setAttendance] = useState<boolean | undefined>();

    const userIsAttending = meeting.attendees.some(attendee => attendee.id === user.id)
    const userHasDeclined = meeting.decliners.some(decliner => decliner.id === user.id)


    useEffect(() => {
        if (userIsAttending) {
            setAttendance(true)
        }
        if (userHasDeclined) {
            setAttendance(false)
        }
    }, [userHasDeclined, userIsAttending])






    const respond = async (isAttending: boolean, VotingPowerGivenTo?: string) => {
        if (isUpvoting) return;

        setIsUpvoting(true);
        try {
            const res = await api.post<unknown>
                (`/meeting/${meeting.id}/respond`, {
                    isAttending,
                    VotingPowerGivenTo
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

    const handleIsDownvoting = () => {
        respond(false, downvotingUser?.id);
        setIsDownvoting(false);
    }

    return (
        <>
            <Dialog open={isDownvoting} onClose={() => setIsDownvoting(false)}>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", justifyContent: "center", height: "220px" }}>
                    <Typography variant="h6">{translate["give_away_voting_power"]}</Typography>
                    <Autocomplete
                        onChange={(_v, user) => setDownvotingUser(user)}
                        options={meeting.attendees?.filter(userArr => userArr.id !== user.id)}
                        sx={{ width: 300 }}
                        getOptionLabel={(v) => v.firstName + " " + v.lastName}
                        renderInput={(params) => <TextField {...params} label={"Välj mottagare"} />}
                    />
                    <Button onClick={handleIsDownvoting} variant="contained">{translate["save"]}</Button>
                </DialogContent>
            </Dialog>
            <NavLink to={"/club/meeting/" + meeting.id} className={homeStyles.hoverLink}>
                <div className={homeStyles.meeting}>

                    <div className={homeStyles.meetingLeft}>
                        <Typography variant='h6' className={homeStyles.meetingTitle}>{time.format("DD/MM/YYYY")}</Typography>
                        <p>{time.format("HH:mm")}</p>
                    </div>
                    <div className={homeStyles.meetingRight}>
                        <Typography variant='h6' className={homeStyles.meetingTitle}>{meeting.name}</Typography>
                        <p>{meeting.location}</p>
                    </div>
                    <div className={homeStyles.attendanceMeetingWrapper}>

                        <Typography variant="body1" className={homeStyles.meetingTitle}>{translate["amount"]}</Typography>

                        <Typography variant="body1" style={{ color: colors.green[700] }}>{meeting.attendees.length}</Typography>
                    </div>

                </div>
                <div className={homeStyles.attendanceMeeting} style={{ marginBottom: "8px", pointerEvents: time < now ? "none" : "auto" }} onClick={(e) => e.preventDefault()} >
                    <FontAwesomeIcon className={`${homeStyles.attendanceVoteIcon} ${attendance ? homeStyles.attendanceVoteIconVoted : ""}`} icon={faThumbsUp} onClick={(e) => {
                        e.preventDefault()
                        respond(true)
                    }
                    } />
                    <AddToCalendarButton
                        customCss=""
                        name={meeting.name}
                        options={['Apple', 'Google']}
                        description={meeting.description}
                        location={meeting.location}
                        startDate={time.format("YYYY-MM-DD")}
                        endDate={time.format("YYYY-MM-DD")}
                        startTime={time.format("HH:mm")}
                        buttonsList
                        endTime="23:30"
                        timeZone="Europe/Stockholm"
                        hideTextLabelButton
                        buttonStyle="round"
                    ></AddToCalendarButton>
                    <FontAwesomeIcon className={`${homeStyles.attendanceVoteIcon} ${!attendance ? homeStyles.attendanceVoteIconVoted : ""}`} icon={faThumbsDown} onClick={(e) => {
                        e.preventDefault()
                        setIsDownvoting(true)

                    }} />
                </div>

                {(meeting.attendees.length > 0 || meeting.decliners.length > 0) && (
                    <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
                        {meeting.attendees.length > 0 && (
                            <Typography variant="body1" color={colors.green[700]}>
                                + {meeting.attendees.map((user, index) => (
                                    <span key={user.id || index}>
                                        {user.firstName} {user.lastName}
                                        {user.votingPower > 1 && (
                                            <span style={{ fontSize: "0.7em", verticalAlign: "super" }}>
                                                {user.votingPower}
                                            </span>
                                        )}
                                        {index < meeting.attendees.length - 1 && ", "}
                                    </span>
                                ))}
                            </Typography>
                        )}
                        {meeting.decliners.length > 0 && (
                            <Typography variant="body1" color={colors.red[700]}>
                                - {meeting.decliners.map(decliner => `${decliner.firstName} ${decliner.lastName}`).join(", ")}
                            </Typography>
                        )}
                    </div>
                )}
            </NavLink>




        </>
    )
}
