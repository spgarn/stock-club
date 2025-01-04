
import { useState } from "react";
import { translate, translateText } from "../../i18n";
import {
    ColumnDef,
    createColumnHelper
} from '@tanstack/react-table'
import BasicTable from "../../components/BasicTable";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons/faEdit";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import api, { getTemplates, Templates as TemplateTypes } from "../../api";
import AddTemplateModal from "./components/AddTemplateModal";
import axios from "axios";
import { toast } from "react-toastify";
import EditTemplateModal from "./components/EditTemplateModal";
import Typography from "@mui/material/Typography";
import useClubs from "../../hooks/useClubs";

const columnHelper = createColumnHelper<TemplateTypes>();
export default function Templates() {
    const { clubId } = useClubs();
    const { data, refetch } = useQuery({
        queryKey: ['club-templates', clubId],
        queryFn: () => getTemplates(clubId),
    });
    const [loading, setLoading] = useState(false);

    const removeTemplate = async (id: number) => {

        if (loading) return;
        if (!confirm(translate["confirm_delete"])) return;
        setLoading(true);
        try {
            const res = await api.delete<unknown>
                ("/templates/" + id, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["template_deleted"]);
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

    const [editTemplate, setEditTemplate] = useState<null | TemplateTypes>(null);
    const [addTemplateOpen, setAddTemplateOpen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns: ColumnDef<TemplateTypes, any>[] = [
        columnHelper.accessor('title', {
            header: () => translate["title"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('createdAt', {
            header: () => translate["createdAt"],
            cell: info => dayjs(info.renderValue() as Date).format("DD/MM/YYYY HH:mm")
        }),
        columnHelper.accessor('updatedAt', {
            header: () => translate["updatedAt"],
            cell: info => dayjs(info.renderValue() as Date).format("DD/MM/YYYY HH:mm")
        }),
        columnHelper.accessor('id', {
            header: "",
            cell: info => {
                return <div className="icon-container">
                    <div className={"edit"} onClick={() => setEditTemplate(info.row.original)} title={translate["edit"]} role="button">
                        <FontAwesomeIcon icon={faEdit} />
                    </div>
                    <div className={"delete"} onClick={() => removeTemplate(info.renderValue() as number)} role="button" title={translate["remove"]}>
                        <FontAwesomeIcon icon={faTrash} />
                    </div>

                </div>
            },
        }),
    ];
    if (!data) {
        return <div>
            <Loading />
        </div>
    }
    return (
        <div>
            <div className="content-header">
                <Typography variant="h5">{translate["templates"]}</Typography>
                <Button onClick={() => setAddTemplateOpen(true)}>{translate["add_template"]}</Button>

            </div>
            <BasicTable columns={columns} data={data} />
            {addTemplateOpen && <AddTemplateModal clubId={clubId} refetch={refetch} handleClose={() => setAddTemplateOpen(false)} />}
            {!!editTemplate && <EditTemplateModal template={editTemplate} refetch={refetch} handleClose={() => setEditTemplate(null)} />}


        </div>
    )
}
