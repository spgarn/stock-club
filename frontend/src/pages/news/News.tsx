import { useState } from "react";
import { translate } from "../../i18n";
import homeStyles from "../home/home.module.scss";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import api, { getDecisions, getEmails, getUser } from "../../api";
import AddDecisionModal from "./components/AddNewsModal";
import axios from "axios";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import useClubs from "../../hooks/useClubs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { Link } from "react-router-dom"; // Assuming React Router is used

const ITEMS_PER_PAGE = 10;

export default function News() {
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
    });

    const { clubId } = useClubs();
    const { data: news, refetch } = useQuery({
        queryKey: ['club-decisions'],
        queryFn: () => getDecisions(),
    });

    const { data: emails } = useQuery({
        queryKey: ['club-emails'],
        queryFn: () => getEmails(),
    });

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const remove = async (id: number) => {
        if (loading) return;
        if (!confirm(translate["confirm_delete_news"])) return;

        setLoading(true);
        try {
            await api.delete(`/news/${id}`, {
                headers: { "Access-Control-Allow-Origin": "*" },
                withCredentials: true
            });
            toast.success(translate["news_deleted"]);
            refetch();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.title || err.message);
            } else {
                toast.error(translate["something_went_wrong"]);
            }
        }
        setLoading(false);
    };

    const [addDecisionOpen, setAddDecisionOpen] = useState(false);

    if (!news || !emails) {
        return <Loading />;
    }

    // Merge and sort all items by date (descending)
    const allItems = [
        ...news.map(article => ({
            id: `decision-${article.id}`,
            type: "decision",
            title: article.title,
            date: article.createdAt
        })),
        ...emails.map(email => ({
            id: `email-${email.dateReceived}`,
            type: "email",
            title: email.subject,
            date: email.dateReceived
        }))
    ].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

    // Pagination logic
    const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
    const paginatedItems = allItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div>
            <div className="content-header">
                <Typography variant="h5">{translate["news"]}</Typography>
                <Button onClick={() => setAddDecisionOpen(true)}>{translate["add_news"]}</Button>
            </div>

            <div className={"content-box " + homeStyles.max500}>
                {paginatedItems.map(item => (
                    <div key={item.id} className={homeStyles.suggestion}>
                        <div className={homeStyles.suggestionHeader}>
                            {dayjs(item.date).format("DD/MM/YYYY")} | {item.type === "decision" ? "Nyhet" : "Email"}
                            {item.type === "decision" && user?.admin && (
                                <div
                                    className={homeStyles.deleteMessage}
                                    aria-label={translate["delete"]}
                                    role="button"
                                    title={translate["delete"]}
                                    onClick={() => remove(parseInt(item.id.replace("decision-", "")))}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                            )}
                        </div>
                        <div>
                            <Typography variant="h6" className={homeStyles.meetingTitle}>
                                <Link to={`/club/news/${item.id}`}>{item.title}</Link>
                            </Typography>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
                    {translate["previous"]}
                </Button>
                <span>{currentPage} / {totalPages}</span>
                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
                    {translate["next"]}
                </Button>
            </div>

            {addDecisionOpen && (
                <AddDecisionModal clubId={clubId} refetch={refetch} handleClose={() => setAddDecisionOpen(false)} />
            )}
        </div>
    );
}