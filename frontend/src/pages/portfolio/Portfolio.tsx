
import { useMemo, useState } from "react";
import { translate } from "../../i18n";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import portfolioStyles from "./portfolio.module.scss";
import { formatCurrency } from "../../funcs/funcs";
import {
    ColumnDef,
    createColumnHelper
} from '@tanstack/react-table'
import BasicTable from "../../components/BasicTable";
import { getStocks, StockHoldings } from "../../api";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import AddStockModal from "./components/AddStockModal";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons/faEdit";
import EditStockModal from "./components/EditStockModal";
const columnHelper = createColumnHelper<StockHoldings>();
export default function Portfolio() {
    const { data, refetch } = useQuery({
        queryKey: ['club-stocks-user'],
        queryFn: () => getStocks(),
    });
    const [addStockOpen, setAddStockOpen] = useState(false);
    const [editStock, setEditStock] = useState<null | StockHoldings>(null);

    const [displayMethod, setDisplayMethod] = useState<"active_stocks" | "sold_stocks">("active_stocks");
    const [currencyDisplay, setCurrencyDisplay] = useState<"kr" | "percent">("kr");
    const {
        totalAmount, totalValue, development, currentStocks, soldStocks
    } = useMemo(() => {
        if (!data) {
            return { totalAmount: 0, totalValue: 0, development: 0, currentStocks: [], soldStocks: [] }
        }
        return { totalAmount: data.length, totalValue: 105495, development: 40.2, currentStocks: data.filter(stock => !stock.sold), soldStocks: data.filter(stock => stock.sold) }
    }, [data]);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnsSold: ColumnDef<StockHoldings, any>[] = [
        columnHelper.accessor('stockName', {
            header: () => translate["stockName"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('investedAt', {
            header: () => translate["investedAt"],
            cell: info => dayjs(info.renderValue() as Date).format("DD/MM/YYYY")
        }),
        columnHelper.accessor('buyPrice', {
            header: () => translate["buyPrice"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('amount', {
            header: translate["amount"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('currentPrice', {
            header: translate["dev_since_buy"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('sellPrice', {
            header: translate["sellPrice"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('id', {
            header: "",
            cell: info => {
                return <div>
                    <div className={"edit"} onClick={() => setEditStock(info.row.original)} title={translate["edit"]} role="button">
                        <FontAwesomeIcon icon={faEdit} />
                    </div>

                </div>
            },
        }),
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnsCurrent: ColumnDef<StockHoldings, any>[] = [
        columnHelper.accessor('stockName', {
            header: () => translate["stockName"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('investedAt', {
            header: () => translate["investedAt"],
            cell: info => dayjs(info.renderValue() as Date).format("DD/MM/YYYY")
        }),
        columnHelper.accessor('buyPrice', {
            header: () => translate["buyPrice"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('amount', {
            header: translate["amount"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('currentPrice', {
            header: translate["dev_since_buy"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('id', {
            header: "",
            cell: info => {
                return <div>
                    <div className={"edit"} onClick={() => setEditStock(info.row.original)} title={translate["edit"]} role="button">
                        <FontAwesomeIcon icon={faEdit} />
                    </div>

                </div>
            },
        }),
    ];
    if (!data) {
        return <div>
            <Loading />
        </div>
    }
    return (
        <div>
            <div className={portfolioStyles.header}>
                <ToggleButtonGroup
                    color="primary"
                    value={displayMethod}
                    exclusive
                    onChange={(_v, r) => setDisplayMethod(r)}
                    aria-label="Display Type"
                >
                    <ToggleButton value="active_stocks">{translate["active_stocks"]}</ToggleButton>
                    <ToggleButton value="sold_stocks">{translate["sold_stocks"]}</ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup
                    color="primary"
                    value={currencyDisplay}
                    exclusive
                    onChange={(_v, r) => setCurrencyDisplay(r)}
                    aria-label="Currency"
                >
                    <ToggleButton value="percent">%</ToggleButton>
                    <ToggleButton value="kr">kr</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className={portfolioStyles.overview}>
                <div>
                    <p>{translate["total_stocks"]}</p>
                    <p>{formatCurrency(totalAmount, false, 0, false)} {translate["individual_metric"]}</p>
                </div>
                <div>
                    <p>{translate["total_value"]}</p>
                    <p>{formatCurrency(totalValue, false, 2, true)} {translate["price_metric"]}</p>
                </div>
                <div>
                    <p>{translate["dev_since_start"]}</p>
                    <p>{formatCurrency(development, false, 2, true)}%</p>
                </div>
            </div>
            {
                displayMethod === "active_stocks" ? <BasicTable columns={columnsCurrent} data={currentStocks} /> : <BasicTable columns={columnsSold} data={soldStocks} />
            }
            <Button sx={{ marginTop: "2rem" }} onClick={() => setAddStockOpen(true)}>{translate["add_investment"]}</Button>
            {addStockOpen && <AddStockModal refetch={refetch} handleClose={() => setAddStockOpen(false)} />}
            {!!editStock && <EditStockModal refetch={refetch} handleClose={() => setEditStock(null)} stock={editStock} />}

        </div>
    )
}
