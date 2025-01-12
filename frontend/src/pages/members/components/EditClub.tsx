import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate, translateText } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import api, { Club } from "../../../api";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";


type ChangeClub = {
    name: string;
    publicInvestments: boolean;
}
export default function EditClub({ handleClose, refetch, club }: { handleClose: () => void; refetch: () => void; club: Club }) {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ChangeClub>({
        defaultValues: {
            publicInvestments: false
        },
    });
    useEffect(() => {
        if (club) {
            reset({
                name: club.name,
                publicInvestments: club.publicInvestments
            });
        }
    }, [club, reset]);
    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<ChangeClub> = async (data: ChangeClub) => {
        setLoading(true);
        try {
            const res = await api.put<unknown>
                ("/club/edit/" + club.id, {
                    ...data,
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["club_edited_success"]);
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
            aria-labelledby="Stock"
            aria-describedby="Stock"
            fullWidth
            maxWidth="xs"
        >
            <BootstrapDialogTitle
                id="edit_alert-dialog-title"
                onClose={() => handleClose()}
            >
                {translate["edit_club"]}
            </BootstrapDialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth={true}
                        error={!!errors.name}
                        id="name"
                        label={translate["name"]}
                        type="text"
                        variant="standard"
                        helperText={errors.name ? errors?.name.message : " "}
                        {...register("name", { required: true })}
                    />


                    <Controller
                        name="publicInvestments"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={value}
                                            onChange={(e) => onChange(e.target.checked)}
                                        />
                                    }
                                    label={translate["public_investment"]} // Example label text, update as needed
                                />

                            </>
                        )}
                    />


                    <div className="align-center">
                        <Button type="submit" variant="contained" disabled={loading}>{loading ? translate["editing_club"] : translate["edit_club"]}</Button>
                    </div>
                </form>


            </DialogContent>
        </Dialog>
    )
}
