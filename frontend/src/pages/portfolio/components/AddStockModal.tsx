import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import api from "../../../api";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import portfolioStyles from "../portfolio.module.scss";
import useClubs from "../../../hooks/useClubs";
import BasicDatePicker from "../../../components/BasicDatePicker";
export type NewInvestment = {
    stockName: string;
    investedAt: Date;
    amount: number;
    buyPrice: number;
    sellPrice: number | null;
    sold: boolean;
    soldAt: Date | null;
    overridePrice: string | null
}
// };
export default function AddStockModal({ handleClose, refetch }: { handleClose: () => void; refetch: () => void; }) {
    const { clubId } = useClubs();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewInvestment>({
        defaultValues: {
            investedAt: new Date(Date.now()),
            soldAt: new Date(Date.now())
        },
    });
    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<NewInvestment> = async (data: NewInvestment) => {
        setLoading(true);
        try {
            const override_price = data.overridePrice;
            const res = await api.post<unknown>
                ("/stocks/add/" + clubId, {
                    ...data,
                    overridePrice: override_price && override_price.length > 0 ? Number(override_price) : undefined
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
                {translate["add_stock"]}
            </BootstrapDialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)} className={portfolioStyles.form}>
                    <TextField
                        fullWidth={true}
                        error={!!errors.stockName}
                        id="stock_title"
                        label={translate["stock_name"]}
                        type="text"
                        variant="standard"
                        helperText={errors.stockName ? errors?.stockName.message : " "}
                        {...register("stockName", { required: true })}
                    />
                    <Controller
                        name="investedAt"
                        control={control}
                        rules={{ required: translate["investment_date_required"] }}
                        render={({ field: { onChange, value } }) => (
                            <BasicDatePicker
                                error={errors.investedAt ? errors?.investedAt.message : undefined}
                                label={translate["investment_date"]}
                                value={dayjs(value)}
                                onChange={(v) => onChange(v?.toDate())}
                            />
                        )}
                    />
                    <TextField
                        fullWidth={true}
                        error={!!errors.amount}
                        id="stock_amount"
                        label={translate["amount_of_stocks"]}
                        type="text"
                        variant="standard"
                        helperText={errors.amount ? errors?.amount.message : " "}
                        {...register("amount", { required: true })}
                    />
                    <TextField
                        fullWidth={true}
                        error={!!errors.buyPrice}
                        id="stock_content"
                        label={translate["price_per_stock"]}
                        type="text"
                        variant="standard"
                        helperText={errors.buyPrice ? errors?.buyPrice.message : " "}
                        {...register("buyPrice", { required: true })}
                        rows={4}
                    />

                    <TextField
                        fullWidth={true}
                        error={!!errors.amount}
                        id="override_price"
                        label={translate["override_price"]}
                        type="text"
                        variant="standard"
                        helperText={errors.amount ? errors?.amount.message : translate["leave_empty_for_automatic"]}
                        {...register("overridePrice", { required: false })}
                    />

                    <Controller
                        name="sold"
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
                                    label={translate["sold_label"]} // Example label text, update as needed
                                />
                                {value && (
                                    <>
                                        <Controller
                                            name="sellPrice"
                                            control={control}
                                            rules={{
                                                required: translate["sell_price_required"],
                                                validate: (value) => Number(value) > 0 || translate["sell_price_positive"]
                                            }}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <TextField
                                                    sx={{ marginLeft: "10px" }}
                                                    label={translate["sell_price"]}
                                                    value={value || ""}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    error={!!error}
                                                    helperText={error ? error.message : ""}
                                                    type="text"
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="soldAt"
                                            control={control}
                                            rules={{ required: translate["sell_date_required"] }}
                                            render={({ field: { onChange, value } }) => (
                                                <BasicDatePicker
                                                    error={errors.soldAt ? errors?.soldAt.message : undefined}
                                                    label={translate["soldAt"]}
                                                    value={dayjs(value ?? new Date(Date.now()))}
                                                    onChange={(v) => onChange(v?.toDate())}
                                                />
                                            )}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    />


                    <div className="align-center">
                        <Button type="submit" variant="contained" disabled={loading}>{loading ? translate["adding_stock"] : translate["add_stock"]}</Button>
                    </div>
                </form>


            </DialogContent>
        </Dialog>
    )
}
