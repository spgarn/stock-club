import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate, translateText } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import api from "../../../api";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import TipTapEditor from "../../../components/TipTapEditor";
export type AddNews = {
    title: string;
    markdown: string;
}
// };
export default function AddNewsModal({ clubId, handleClose, refetch }: { clubId: number; handleClose: () => void; refetch: () => void; }) {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddNews>();
    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<AddNews> = async (data: AddNews) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await api.post<unknown>
                ("/news/add/" + clubId, {
                    ...data,
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["news_created_success"]);
            refetch();
            handleClose();
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
    return (
        <Dialog
            open={true}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="xs"
        >
            <BootstrapDialogTitle
                id="alert-dialog-title"
                onClose={() => handleClose()}
            >
                {translate["add_news"]}
            </BootstrapDialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth={true}
                        error={!!errors.title}
                        id="decision_title"
                        label={translate["title"]}
                        type="text"
                        variant="standard"
                        helperText={errors.title ? errors?.title.message : " "}
                        {...register("title", { required: true })}
                    />
                    <Controller
                        name="markdown"
                        control={control}
                        rules={{ required: translate["markdown_required"] }}
                        render={({ field: { onChange, value } }) => (
                            <TipTapEditor content={value} label={translate["template"]} onChange={onChange} />

                        )}
                    />


                    <div className="align-center">
                        <Button sx={{ marginTop: "10px" }} type="submit" variant="contained" disabled={loading}>{loading ? translate["adding_news"] : translate["add_news"]}</Button>
                    </div>
                </form>


            </DialogContent>
        </Dialog>
    )
}
