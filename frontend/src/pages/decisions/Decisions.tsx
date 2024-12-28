
import { useState } from "react";
import { translate } from "../../i18n";
import homeStyles from "../home/home.module.scss";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import api, { getDecisions, getUser } from "../../api";
import AddDecisionModal from "./components/AddDecisionModal";
import axios from "axios";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import useClubs from "../../hooks/useClubs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import DOMPurify from 'dompurify';

export default function Decisions() {
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
    });
    const { clubId } = useClubs();
    const { data, refetch } = useQuery({
        queryKey: ['club-decisions'],
        queryFn: () => getDecisions(),
    });
    const [loading, setLoading] = useState(false);

    const remove = async (id: number) => {

        if (loading) return;
        if (!confirm(translate["confirm_delete_news"])) return;
        setLoading(true);
        try {
            const res = await api.delete<unknown>
                ("/decisions/" + id, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["news_deleted"]);
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
        setLoading(false);
    }

    const [addDecisionOpen, setAddDecisionOpen] = useState(false);


    if (!data) {
        return <div>
            <Loading />
        </div>
    }

    return (
        <div>
            <div className="content-header">
                <Typography variant="h5">{translate["decisions"]}</Typography>
                <Button onClick={() => setAddDecisionOpen(true)}>{translate["add_decision"]}</Button>
            </div>
            <div className={"content-box " + homeStyles.max500}>
                {data.map(news => {
                    const html = DOMPurify.sanitize(news.markdown);
                    return <div className={homeStyles.suggestion}>
                        <div className={homeStyles.suggestionHeader}>{dayjs(news.createdAt).format("DD/MM/YYYY")} | Nyhet {" "} {(user?.admin) && <div className={homeStyles.deleteMessage} aria-label={translate["delete"]} role='button' title={translate["delete"]} onClick={() => remove(news.id)}><FontAwesomeIcon icon={faXmark} /></div>}</div>
                        <div>
                            <Typography variant='h6' className={homeStyles.meetingTitle}>{news.title}</Typography>
                        </div>
                        <div className="p-1">
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
                        </div>
                    </div>
                }
                )}

            </div>
            {addDecisionOpen && <AddDecisionModal clubId={clubId} refetch={refetch} handleClose={() => setAddDecisionOpen(false)} />}
        </div>
    )
}
