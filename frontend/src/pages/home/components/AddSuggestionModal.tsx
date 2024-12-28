
// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,

import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate, translateText } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import api from "../../../api";
export type NewSuggestion = {
    title: string;
    description: string;
}
// };
export default function AddSuggestionModal({ handleClose, refetch, clubId }: { handleClose: () => void; refetch: () => void; clubId: number }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewSuggestion>();
    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<NewSuggestion> = async (data: NewSuggestion) => {
        setLoading(true);
        try {
            const res = await api.post<unknown>
                ("/club/suggestion/" + clubId, data, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["suggestion_created_success"]);
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
                {translate["add_proposal"]}
            </BootstrapDialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth={true}
                        error={!!errors.title}
                        id="suggestion_title"
                        label={translate["enter_title"]}
                        type="text"
                        variant="standard"
                        helperText={errors.title ? errors?.title.message : " "}
                        {...register("title", { required: true })}
                    />
                    <TextField
                        fullWidth={true}
                        error={!!errors.description}
                        id="suggestion_content"
                        label={translate["enter_content"]}
                        type="text"
                        variant="standard"
                        helperText={errors.description ? errors?.description.message : " "}
                        {...register("description", { required: true })}
                        rows={4}
                    />
                    <div className="align-center">
                        <Button type="submit" variant="contained" disabled={loading}>{loading ? translate["adding"] : translate["add"]}</Button>
                    </div>
                </form>


            </DialogContent>
            {/* <DialogActions>
                <Button
                    onClick={() => save({ title: "", content: "" })}
                >
                    Confirm
                </Button>
            </DialogActions> */}
        </Dialog>
    )
}
