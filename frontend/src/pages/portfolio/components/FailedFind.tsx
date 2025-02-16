import Button from '@mui/material/Button';
import { useState } from 'react'
import { translate } from '../../../i18n';
import TextField from '@mui/material/TextField';

export default function FailedFind({ item, updateStock }: { item: { id: string; name: string }, updateStock: (v: null | { overridePrice: number } | { stockName: string }) => void }) {
    const [type, setType] = useState<null | "override_price" | "change_ticker" | "skip">(null);
    const [price, setPrice] = useState("");
    const [ticker, setTicker] = useState("");
    const update = () => {
        switch (type) {
            case "override_price": {
                updateStock({ overridePrice: Number(price) });
                break;
            }
            case "change_ticker": {
                updateStock({ stockName: ticker });
                break;
            }
            default: {
                console.log("Not implemented")
                break;
            }
        }
        setType(null);
        setPrice("");
        setTicker("");
    }
    return (
        <div>
            <p>{item.name}</p>
            {!type && <>
                <Button onClick={() => setType("override_price")}>{translate["override_price"]}</Button>
                <Button onClick={() => setType("change_ticker")}>{translate["change_ticker"]}</Button>
                <Button onClick={() => updateStock(null)}>{translate["skip"]}</Button>
            </>}
            {type && <div>
                {type === "override_price" && <TextField label={translate["override_price"]} value={price} onChange={(v) => setPrice(v.target.value)} />}
                {type === "change_ticker" && <TextField label={translate["change_ticker"]} value={ticker} onChange={(v) => setTicker(v.target.value)} />}
                <div>
                    <Button onClick={() => setType(null)}>{translate["back"]}</Button>
                    <Button onClick={() => update()}>{translate["confirm"]}</Button>
                </div>
            </div>}
        </div>
    )
}
