
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
export type NewDecision = {
    title: string;
    timeUntilExpiry: number;
}
// };
export default function AddDecisionModal({ handleClose, refetch, clubId, meetingId }: { handleClose: () => void; refetch: () => void; clubId: number, meetingId: number }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewDecision>();
    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<NewDecision> = async (data: NewDecision) => {
        setLoading(true);
        try {
            const res = await api.post<unknown>
                ("meeting_decisions/add/" + clubId + "/" + meetingId, {
                    ...data,
                    timeUntilExpiry: Number(data.timeUntilExpiry)
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["decision_created_success"]);
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
                {translate["add_decision"]}
            </BootstrapDialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth={true}
                        error={!!errors.title}
                        id="decision_title"
                        label={translate["enter_title"]}
                        type="text"
                        variant="standard"
                        helperText={errors.title ? errors?.title.message : " "}
                        {...register("title", { required: true })}
                    />
                    <TextField
                        fullWidth={true}
                        error={!!errors.timeUntilExpiry}
                        id="decision_content"
                        label={translate["enter_time_until_expiry"]}
                        type="numbers"
                        variant="standard"
                        helperText={errors.timeUntilExpiry ? errors?.timeUntilExpiry.message : " "}
                        {...register("timeUntilExpiry", { required: true })}
                        rows={4}
                    />
                    <div className="align-center">
                        <Button type="submit" variant="contained" disabled={loading}>{loading ? translate["adding"] : translate["add"]}</Button>
                    </div>
                </form>


            </DialogContent>
        </Dialog>
    )
}
