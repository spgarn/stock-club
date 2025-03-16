import { useState } from 'react'
import api, { MeetingDecisions, User } from '../../../api';
import axios from 'axios';
import { translate, translateText } from '../../../i18n';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Decision from './Decision';

export default function Decisions({ user, refetch, meetingsDecisions }: { user: User; refetch: () => void; meetingsDecisions: MeetingDecisions[] }) {
    const [isUpvoting, setIsUpvoting] = useState(false);
    const { id: meetingId } = useParams()
    const react = async (decisionId: number, isUpvote: boolean) => {
        if (isUpvoting) return;

        setIsUpvoting(true);
        try {
            const res = await api.post<unknown>
                ("/meeting_decisions/react", {
                    decisionId,
                    isUpvote
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

    const removeDecision = async (suggestionId: number) => {
        if (isUpvoting) return;
        if (!confirm(translate["confirm_delete_decision"])) return;
        setIsUpvoting(true);
        try {
            const res = await api.delete<unknown>
                ("/meeting_decisions/delete/" + suggestionId, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["decision_deleted_success"]);
            refetch();
            console.log(resData);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data) {
                    toast.error(err.response?.data?.title);
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
        <div className={`suggestions-wrapper ${!meetingId && "home-suggestions-wrapper"}`} >
            {meetingsDecisions.length === 0 && <p className='text-center p-1'>{translate["no_decisions"]}</p>}
            {meetingsDecisions.map(decision => <Decision user={user} react={react} decision={decision} key={decision.id} removeDecision={removeDecision} />)}
        </div>
    )
}
