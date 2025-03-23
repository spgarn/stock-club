import { colors, Typography, } from "@mui/material";
import { CurrencyRate } from "../../../api";
import { formatCurrency } from "../../../funcs/funcs";
import { translate } from "../../../i18n";
import Loading from "../../../components/Loading";

export const Currencies = ({ currencies }: { currencies: CurrencyRate[] }) => {
    if (currencies.length === 0) return <Loading />
    return (
        <>
            <div className={"content-box"}>
            <Typography style={{ padding: "12px" }} variant="h6">{translate["currency"]}</Typography>
                {currencies?.filter(currency => currency.name !== "SEK").map(currency => <div key={currency.id} style={{ display: "flex", gap: "10px", padding: "12px" }}>
                    <span style={{ color: colors.blueGrey["400"] }}>{currency.name}:</span>
                    <span>{formatCurrency(currency.rate)}</span>
                </div>)}

            </div>
        </>
    );
};
