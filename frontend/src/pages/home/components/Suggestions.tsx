import { useState } from 'react'
import api, { MeetingSuggestion, User } from '../../../api';
import Suggestion from './Suggestion';
import axios from 'axios';
import { translate, translateText } from '../../../i18n';
import { toast } from 'react-toastify';

export default function Suggestions({ user, refetch, meetingsSuggestions }: { user: User; refetch: () => void; meetingsSuggestions: MeetingSuggestion[] }) {
    const [isUpvoting, setIsUpvoting] = useState(false);
    const react = async (suggestionId: number, isUpvote: boolean) => {
        if (isUpvoting) return;

        setIsUpvoting(true);
        try {
            const res = await api.post<unknown>
                ("/club/react", {
                    suggestionId,
                    isUpvote
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            //toast.success(translate["react_created_success"]);
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
    const removeSuggestion = async (suggestionId: number) => {
        if (isUpvoting) return;
        if (!confirm(translate["confirm_delete_suggestion"])) return;
        setIsUpvoting(true);
        try {
            const res = await api.delete<unknown>
                ("/club/suggestion/delete/" + suggestionId, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["suggestion_deleted_success"]);
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
        <div className="content-box">
            {meetingsSuggestions.map(suggestion => <Suggestion user={user} react={react} suggestion={suggestion} key={suggestion.id} removeSuggestion={removeSuggestion} />)}
        </div>
    )
}
