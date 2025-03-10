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
import { NewInvestment } from "./AddStockModal";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import portfolioStyles from "../portfolio.module.scss";
import useClubs from "../../../hooks/useClubs";

// };
export default function EditStockModal({ handleClose, refetch, stock }: { handleClose: () => void; refetch: () => void; stock: StockHoldings }) {
    const { clubId } = useClubs();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<NewInvestment>({
        defaultValues: {
            investedAt: new Date(Date.now()),
            soldAt: new Date(Date.now())
        },
    });
    useEffect(() => {
        if (stock) {
            reset({
                stockName: stock.stockName,
                investedAt: stock.investedAt ?? new Date(Date.now()),
                amount: stock.amount,
                buyPrice: stock.buyPrice,
                sellPrice: stock.sellPrice ?? stock.currentPrice,
                sold: stock.sold,
                currency: stock.currency,
                soldAt: new Date(Date.now()),
                overridePrice: stock.overridePrice ? String(stock.overridePrice) : null
            });
        }
    }, [stock, reset]);
    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<NewInvestment> = async (data: NewInvestment) => {
        setLoading(true);
        const override_price = data.overridePrice;
        try {
            await api.put<unknown>
                ("/stocks/edit/" + stock.id + "/club/" + clubId, {
                    ...data,
                    overridePrice: override_price && override_price.length > 0 ? Number(override_price) : undefined,
                    currency: stock.currency
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            toast.success(translate["stock_updated_success"]);
            refetch();
            handleClose();
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
                {translate["edit_stock"]}
            </BootstrapDialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)} className={portfolioStyles.form}>
                    <TextField
                        fullWidth={true}
                        error={!!errors.stockName}
                        id="edit_stock_title"
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
                            <BasicDateTimePicker
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
                        id="edit_stock_amount"
                        label={translate["amount_of_stocks"]}
                        type="text"
                        variant="standard"
                        helperText={errors.amount ? errors?.amount.message : " "}
                        {...register("amount", { required: true })}
                    />
                    <TextField
                        fullWidth={true}
                        error={!!errors.buyPrice}
                        id="edit_stock_content"
                        label={translate["buyPrice"]}
                        type="text"
                        variant="standard"
                        helperText={errors.buyPrice ? errors?.buyPrice.message : " "}
                        {...register("buyPrice", { required: true })}
                        rows={4}
                    />
                    {/* <TextField
                        fullWidth={true}
                        error={!!errors.amount}
                        id="override_price"
                        label={translate["override_price"]}
                        type="text"
                        variant="standard"
                        helperText={errors.amount ? errors?.amount.message : translate["leave_empty_for_automatic"]}
                        {...register("overridePrice", { required: true })}
                    /> */}
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
                                                <BasicDateTimePicker
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
                        <Button type="submit" variant="contained" disabled={loading}>{loading ? translate["editing_stock"] : translate["edit_stock"]}</Button>
                    </div>
                </form>


            </DialogContent>
        </Dialog>
    )
}
