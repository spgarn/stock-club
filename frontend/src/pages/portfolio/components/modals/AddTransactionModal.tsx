import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useClubs from "../../../../hooks/useClubs";
import { useState } from "react";
import api from "../../../../api";
import { translate } from "../../../../i18n";
import { toast } from "react-toastify";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../../components/BootstrapDialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import BasicDatePicker from "../../../../components/BasicDatePicker";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import portfolioStyles from "../../portfolio.module.scss";
import Autocomplete from "@mui/material/Autocomplete";

type TransactionTypes = "Uttag" | "Insättning" | undefined

export type NewTransaction = {
    date: Date;
    amount: number;
    type: TransactionTypes;
}


export const AddTransactionModal = ({ handleClose, refetch }: { handleClose: () => void; refetch: () => void; }) => {
    const { clubId } = useClubs();
    const [type, setType] = useState<TransactionTypes>();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewTransaction>()
    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<NewTransaction> = async (data: NewTransaction) => {
        setLoading(true);
        try {
            const res = await api.post<unknown>
                ("/transactions/add/" + clubId, {
                    ...data,
                    type: type
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["stock_created_success"]);
            refetch();
            handleClose();
            console.log(resData);
        } catch (err) {
            console.log(err);
            if (axios.isAxiosError(err)) {

                toast.error(translate["invalid_stock"])
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
                {translate["add_transaction"]}
            </BootstrapDialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)} className={portfolioStyles.form}>
                    <Autocomplete
                        onChange={(_v, r) => setType(r?.name as TransactionTypes)}
                        disablePortal
                        options={[{ name: "Uttag" }, { name: "Insättning" }]}
                        sx={{ width: 300, mt: "12px" }}
                        getOptionLabel={(v) => v.name}
                        renderInput={(params) => <TextField {...params} label={translate["csv_import_transaction_type"]} />}
                    />
                    <Controller
                        name="date"
                        control={control}
                        defaultValue={dayjs().toDate()}
                        render={({ field: { onChange, value } }) => (
                            <BasicDatePicker
                                error={errors.date ? errors?.date.message : undefined}
                                label={translate["csv_import_date"]}
                                value={dayjs(value)}
                                onChange={(v) => onChange(v?.toDate())}
                            />
                        )}
                    />
                    <TextField
                        fullWidth={true}
                        error={!!errors.amount}
                        id="amount"
                        label={translate["sum"]}
                        type="text"
                        variant="standard"
                        helperText={errors.amount ? errors?.amount.message : " "}
                        {...register("amount", { required: true })}
                    />


                    <div className="align-center">
                        <Button type="submit" variant="contained" disabled={loading}>{loading ? translate["adding"] : translate["add_transaction"]}</Button>
                    </div>
                </form>


            </DialogContent>
        </Dialog>
    )
};
