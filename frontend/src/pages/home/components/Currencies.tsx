import { colors, Typography, } from "@mui/material";
import { CurrencyRate } from "../../../api";
import { formatCurrency } from "../../../funcs/funcs";
import { translate } from "../../../i18n";

export const Currencies = ({ currencies }: { currencies: CurrencyRate[] }) => {
    return (
        <>
            <Typography variant="h5">{translate["info"]}</Typography>
            <div className={"content-box"}>
                {currencies?.filter(currency => currency.name !== "SEK").map(currency => <div key={currency.id} style={{ display: "flex", gap: "10px", padding: "12px" }}>
                    <span style={{ color: colors.blueGrey["400"] }}>{currency.name}:</span>
                    <span>{formatCurrency(currency.rate)}</span>
                </div>)}

            </div>
        </>
    );
};
