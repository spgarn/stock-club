import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate, translateText } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import api, { Templates } from "../../../api";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import TipTapEditor from "../../../components/TipTapEditor";
export type ChangeTemplate = {
    title: string;
    markdown: string;
}
// };
export default function EditTemplateModal({ handleClose, refetch, template }: { handleClose: () => void; refetch: () => void; template: Templates }) {
    const {
        reset,
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ChangeTemplate>();
    useEffect(() => {
        if (template) {
            reset({
                title: template.title,
                markdown: template.markdown
            });
        }
    }, [template, reset]);
    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<ChangeTemplate> = async (data: ChangeTemplate) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await api.put<unknown>
                ("/templates/edit", {
                    ...template,
                    ...data,
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["template_updated_success"]);
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
                {translate["edit_template"]}
            </BootstrapDialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth={true}
                        error={!!errors.title}
                        id="template_title"
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
                        <Button sx={{ marginTop: "10px" }} type="submit" variant="contained" disabled={loading}>{loading ? translate["editing_template"] : translate["edit_template"]}</Button>
                    </div>
                </form>


            </DialogContent>
        </Dialog>
    )
}
