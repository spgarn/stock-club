import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate, translateText } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import api, { StockHoldings } from "../../../api";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import BasicDateTimePicker from "../../../components/BasicDateTimePicker";
import dayjs from "dayjs";
import portfolioStyles from "../portfolio.module.scss";
import { formatCurrency } from "../../../funcs/funcs";
import useClubs from "../../../hooks/useClubs";

type SellChunk = {
    amount: number;
    sellPrice: number;
    soldAt: Date;
}
export default function SellPortionModal({ handleClose, refetch, stock }: { handleClose: () => void; refetch: () => void; stock: StockHoldings }) {
    const { clubId } = useClubs();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<SellChunk>({
        defaultValues: {
            soldAt: new Date(Date.now())
        },
    });
    useEffect(() => {
        if (stock) {
            reset({
                amount: Number(stock.amount),
                sellPrice: stock.currentPrice,
                soldAt: new Date(Date.now())
            });
        }
    }, [stock, reset]);
    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<SellChunk> = async (data: SellChunk) => {
        setLoading(true);
        try {
            const res = await api.put<unknown>
                ("/stocks/sellportion/club/" + clubId, {
                    id: stock.id,
                    ...data,
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["stock_updated_success"]);
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
                {translate["sell"]} {stock.stockName}
            </BootstrapDialogTitle>

            <DialogContent>
                <p className="p-1">{stock.stockName} {translate["sell_portion_desc"]}</p>
                <form onSubmit={handleSubmit(onSubmit)} className={portfolioStyles.form}>
                    <div className={portfolioStyles.sellMaxAmount}>
                        <TextField
                            fullWidth={true}
                            error={!!errors.amount}
                            id="split_amount"
                            label={translate["amount_of_stocks"]}
                            type="text"
                            variant="standard"
                            helperText={errors.amount ? errors?.amount.message : " "}
                            {...register("amount", { required: true, validate: (value) => Number(value) <= stock.amount || translate["amount_less_than_current"] })}
                        />
                        <p>/ {formatCurrency(stock.amount, false, 0, false)}</p>
                    </div>

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
                            <BasicDateTimePicker
                                error={errors.soldAt ? errors?.soldAt.message : undefined}
                                label={translate["soldAt"]}
                                value={dayjs(value ?? new Date(Date.now()))}
                                onChange={(v) => onChange(v?.toDate())}
                            />
                        )}
                    />

                    <div className="align-center">
                        <Button type="submit" variant="contained" disabled={loading}>{loading ? translate["selling_portion"] : translate["sell_portion"]}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
