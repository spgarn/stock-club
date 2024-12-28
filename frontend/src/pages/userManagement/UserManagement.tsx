
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
import { base_url, getUser, getUsersInClub, User } from "../../api";
import axios from "axios";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import useClubs from "../../hooks/useClubs";
import { TextField } from "@mui/material";

// const data: TemplateTypes[] = [{
//     id: 1,
//     title: "hej",
//     markdown: "hejsan",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     club: {
//         id: 0,
//         name: "test"
//     }
// }]
const columnHelper = createColumnHelper<User>();
export default function UserManagement() {
    const [email, setEmail] = useState("");
    const { clubId } = useClubs();
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
    });
    const { data: usersInClub, refetch } = useQuery({
        queryKey: ['usermanagement-in-club', clubId],
        queryFn: () => getUsersInClub(clubId),
    });
    const [loading, setLoading] = useState(false);
    const addUser = async () => {
        if (loading || email.length < 1) return;
        setLoading(true);
        try {
            const res = await axios.post<unknown>
                (base_url + '/usermanagement/add/' + clubId, { email }, {
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
            const res = await axios.delete<unknown>
                (base_url + '/usermanagement/' + clubId + "/userid/" + id, {
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
        columnHelper.accessor("email", {
            header: () => translate["email"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor("firstName", {
            header: () => translate["firstName"],
            cell: info => info.renderValue()
        }),
        columnHelper.accessor("lastName", {
            header: () => translate["lastName"],
            cell: info => info.renderValue()
        }),
        columnHelper.accessor('id', {
            header: "",
            cell: info => {
                return <div>
                    <div className={templateStyles.delete} onClick={() => removeUser(info.renderValue() as string)} role="button" title={translate["remove"]}>
                        <FontAwesomeIcon icon={faTrash} />
                    </div>

                </div>
            },
        }),
    ];
    if (!usersInClub) {
        return <div>
            <Loading />
        </div>
    }
    return (
        <div>
            <div className="content-header">
                <Typography variant="h5">{translate["users"]}</Typography>
                <div className="flexGap">
                    <TextField disabled={loading} value={email} onChange={(v) => setEmail(v.target.value)} label={translate["enter_email"]} />
                    <Button disabled={loading} variant="contained" onClick={addUser}>{translate["add_user"]}</Button>
                </div>

            </div>
            <BasicTable columns={columns} data={usersInClub} />


        </div>
    )
}
