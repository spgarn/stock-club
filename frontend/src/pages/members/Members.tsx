
import { useState } from "react";
import { translate, translateText } from "../../i18n";
import templateStyles from "../templates/templates.module.scss";
import {
    ColumnDef,
    createColumnHelper
} from '@tanstack/react-table'
import BasicTable from "../../components/BasicTable";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import api, { Club, getUser, getUsersInClub, User } from "../../api";
import axios from "axios";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import useClubs from "../../hooks/useClubs";
import { TextField } from "@mui/material";
import EditClub from "./components/EditClub";

const columnHelper = createColumnHelper<User>();
export default function Members() {
    const [showEditClub, setShowEditClub] = useState<null | Club>(null);
    const [email, setEmail] = useState("");
    const { clubId, activeClub, refetchClubs } = useClubs();
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
    });
    const isAdmin = !!user?.admin;
    const { data: usersInClub, refetch } = useQuery({
        queryKey: ['usermanagement-in-club', clubId],
        queryFn: () => getUsersInClub(clubId),
    });
    const [loading, setLoading] = useState(false);
    const addUser = async () => {
        if (loading || email.length < 1) return;
        setLoading(true);
        try {
            const res = await api.post<unknown>
                ('/usermanagement/add/' + clubId, { email }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["user_added"]);
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
        setLoading(false);
    }

    const removeUser = async (id: string) => {
        if (id == user?.id) {
            toast.error(translate["can_not_delete_yourself"])
            return;
        }

        if (loading) return;
        if (!confirm(translate["confirm_delete_user"])) return;
        setLoading(true);
        try {
            const res = await api.delete<unknown>
                ('/usermanagement/' + clubId + "/userid/" + id, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["user_deleted"]);
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
        setLoading(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns: ColumnDef<User, any>[] = [
        columnHelper.accessor("id", {
            header: () => translate["name"],
            cell: (info) => {
                const original = info.row.original;
                return <p>{original.firstName} {original.lastName}</p>
            }
        }),
        columnHelper.accessor("email", {
            header: () => translate["email"],
            cell: info => info.renderValue(),
        }),
        ...(isAdmin ? [columnHelper.accessor('id', {
            header: "",
            cell: info => {
                return <div>
                    <div className={templateStyles.delete} onClick={() => removeUser(info.renderValue() as string)} role="button" title={translate["remove"]}>
                        <FontAwesomeIcon icon={faTrash} />
                    </div>

                </div>
            },
        })] : []),
    ];
    if (!usersInClub) {
        return <div>
            <Loading />
        </div>
    }
    return (
        <div>
            <div className="content-header">
                <Typography variant="h5">{translate["members"]}</Typography>
                {isAdmin ? <div className="flexGap">
                    <TextField disabled={loading} value={email} onChange={(v) => setEmail(v.target.value)} label={translate["enter_email"]} />
                    <Button disabled={loading} variant="contained" onClick={addUser}>{translate["add_user"]}</Button>
                </div> : <div></div>}

            </div>
            <BasicTable columns={columns} data={usersInClub} />
            {!!activeClub && <Button sx={{ marginTop: "1rem" }} onClick={() => setShowEditClub(activeClub)}>{translate["edit_club"]}</Button>}
            {!!showEditClub && <EditClub refetch={refetchClubs} handleClose={() => setShowEditClub(null)} club={showEditClub} />}

        </div>
    )
}
