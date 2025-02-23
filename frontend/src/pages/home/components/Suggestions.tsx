import { useState } from 'react'
import api, { MeetingSuggestion, User } from '../../../api';
import Suggestion from './Suggestion';
import axios from 'axios';
import { translate, translateText } from '../../../i18n';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

export default function Suggestions({ user, refetch, meetingsSuggestions }: { user: User; refetch: () => void; meetingsSuggestions: MeetingSuggestion[] }) {
    const [isUpvoting, setIsUpvoting] = useState(false);
    const { id: meetingId } = useParams()
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
    const toggleActive = async (suggestionId: number) => {
        if (isUpvoting) return;

        setIsUpvoting(true);
        try {
            const res = await api.post<unknown>
                (`/club/togglesuggestion/${suggestionId}`, {

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
        <div className={`suggestion-wrapper ${!meetingId && "home-suggestions-wrapper" }`} >
            {meetingsSuggestions.length === 0 && <p className='text-center p-1'>{translate["no_suggestions"]}</p>}
            {meetingsSuggestions.filter(suggestions => !meetingId || suggestions.meeting.id === Number(meetingId)).map(suggestion => <Suggestion user={user} react={react} toggleActive={toggleActive} suggestion={suggestion} key={suggestion.id} removeSuggestion={removeSuggestion} />)}
        </div>
    )
}
