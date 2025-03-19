
import { useState } from "react";
import { translate, translateText } from "../../i18n";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import portfolioStyles from "./portfolio.module.scss";
import { formatCurrency } from "../../funcs/funcs";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import EditStockModal from "./components/modals/EditStockModal";
import { toast } from "react-toastify";
import axios from "axios";
import RowSelect from "../../components/RowSelect";
import Pagination from "@mui/material/Pagination";
import useClubs from "../../hooks/useClubs";
import api, { getCurrencyRates, getStocks, getTransactions, StockHoldings } from "../../api";
import RenderStocks from "./components/RenderStocks";
import DisplayToggle from "./components/DisplayToggle";
import useStocks from "./components/hooks/useStocks";
import { useParams } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import SellPortionModal from "./components/modals/SellPortionModal";
import ImportModal from "./components/modals/ImportModal";
import AddStockModal from "./components/modals/AddStockModal";
import useTransactions from "./components/hooks/useTransactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { ChangeCashModal } from "./components/modals/ChangeCashModal";
import { AddTransactionModal } from "./components/modals/AddTransactionModal";

export default function Portfolio() {
    const { id } = useParams(); // THis is for public
    const { clubId: activeClubId, activeClub, refetchClubs } = useClubs();
    const isPublic = !activeClubId && !!id;
    const clubId = id ? Number(id) : activeClubId;
    const { data, refetch, error } = useQuery({
        queryKey: ['club-stocks', clubId],
        queryFn: () => getStocks(clubId),
    });
    const { data: transactions, refetch: transactionRefetch } = useQuery({
        queryKey: ['club-transactions', clubId],
        queryFn: () => getTransactions(clubId),
    });
    const { data: currencies } = useQuery({
        queryKey: ["currency"],
        queryFn: getCurrencyRates,
    });

    const [rowCount, setRowCount] = useState(20);
    const [page, setPage] = useState(1);
    const [addStockOpen, setAddStockOpen] = useState(false);
    const [addTransactioOpen, setAddTransactioOpen] = useState(false);
    const [importModal, setImportModal] = useState(false);
    const [changeCash, setChangeCash] = useState(false);
    const [editStock, setEditStock] = useState<null | StockHoldings>(null);
    const [sellPortion, setSellPortion] = useState<null | StockHoldings>(null);
    const [loading, setLoading] = useState(false);
    const [displayMethod, setDisplayMethod] = useState<"active_stocks" | "history">("active_stocks");
    const [currencyDisplay, setCurrencyDisplay] = useState<"kr" | "percent">("kr");
    const {
        totalValue, totalAmount, development, list
    } = useStocks(data, displayMethod, setPage, currencies ?? []);

    const { netDeposit, transactionList } = useTransactions(transactions, displayMethod, setPage);


    const changeRow = (row: number) => {
        setRowCount(row);
        setPage(1);
    }

    if (!activeClub) return <Loading />;

    const removeStock = async (id: number) => {

        if (loading) return;
        if (!confirm(translate["confirm_delete_stock"])) return;
        setLoading(true);
        try {
            const res = await api.delete<unknown>
                ("/stocks/" + id, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["stock_deleted"]);
            refetch();
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


    const maxPages = Math.ceil(list.length / rowCount);
    if (error) {
        return <div>
            <ErrorMessage error={String(error?.message)} />
        </div>
    }
    if (!data) {
        return <div>
            <Loading />
        </div>
    }

    return (
        <div>
            <div className={portfolioStyles.header}>
                <DisplayToggle displayMethod={displayMethod} setDisplayMethod={setDisplayMethod} />
                <ToggleButtonGroup
                    color="primary"
                    value={currencyDisplay}
                    exclusive
                    onChange={(_v, r) => setCurrencyDisplay(r)}
                    aria-label="Currency"
                    size="small"
                >
                    <ToggleButton size="small" value="percent">%</ToggleButton>
                    <ToggleButton size="small" value="kr">kr</ToggleButton>
                </ToggleButtonGroup>
            </div>
            {
                displayMethod === "active_stocks" ?
                    <div className={portfolioStyles.overview}>

                        <div>
                            <p>{translate["total_stocks"]}</p>
                            <p>{formatCurrency(totalAmount, false, 0, false)} {translate["individual_metric"]}</p>
                        </div>
                        <div>
                            <p>{translate["total_value"]}</p>
                            <p>{formatCurrency(totalValue, false, 0, false)} {translate["price_metric"]}</p>
                        </div>
                        <div>
                            <p>{translate[displayMethod === "active_stocks" ? "dev_since_start" : "yield"]}</p>
                            <p className={development >= 0 ? portfolioStyles.positive : portfolioStyles.negative}>{formatCurrency(development, false, 0, true)}%</p>
                        </div>
                    </div>
                    : <div className={portfolioStyles.overview}>

                        <div>
                            <p>{translate["portfolio_value"]}</p>
                            <p>{formatCurrency(totalValue, false, 0, false)} {translate["price_metric"]}</p>
                        </div>
                        <div>
                            <p>{translate["net_deposit"]}</p>
                            <p>{formatCurrency(netDeposit, false, 0, false)} {translate["price_metric"]}</p>
                        </div>
                        <div>
                            <p>{translate["cash"]}  <FontAwesomeIcon
                                onClick={() => setChangeCash(true)}
                                icon={faRefresh}
                                style={{
                                    marginLeft: 5,
                                    cursor: "pointer"
                                }}
                                size='sm'
                            /></p>
                            <p>{formatCurrency(activeClub.cash, false, 0, false)} {translate["price_metric"]}</p>
                        </div>
                        <div>
                            <p>{translate["dev_since_start"]}</p>
                            <p className={development >= 0 ? portfolioStyles.positive : portfolioStyles.negative}>{formatCurrency(totalValue + activeClub.cash - netDeposit, false, 0, true)} {translate["price_metric"]} / {formatCurrency(((netDeposit - (totalValue + activeClub.cash)) / netDeposit) * -100, false, 2, true)} %</p>
                        </div>

                    </div>
            }
            <div className={portfolioStyles.actionContainer}>
                {!isPublic ? <Button onClick={() => setAddStockOpen(true)}>{translate["add_investment"]}</Button> : <p></p>}
                {!isPublic ? <Button onClick={() => setAddTransactioOpen(true)}>{translate["add_transaction"]}</Button> : <p></p>}
                <div>
                    <RowSelect
                        value={rowCount}
                        changeValue={changeRow}
                    />
                </div>
            </div>

            <RenderStocks transactions={transactionList} currencies={currencies ?? []} list={list} page={page} rowCount={rowCount} currencyDisplay={currencyDisplay} displayMethod={displayMethod} removeStock={removeStock} setEditStock={setEditStock} setSellPortion={setSellPortion} isPublic={isPublic} />
            {addStockOpen && <AddStockModal refetch={refetch} handleClose={() => setAddStockOpen(false)} />}
            {addTransactioOpen && <AddTransactionModal refetch={transactionRefetch} handleClose={() => setAddTransactioOpen(false)} />}
            {!!editStock && <EditStockModal refetch={refetch} handleClose={() => setEditStock(null)} stock={editStock} />}
            {!!sellPortion && <SellPortionModal refetch={refetch} handleClose={() => setSellPortion(null)} stock={sellPortion} />}
            {importModal && <ImportModal refetch={refetch} handleClose={() => setImportModal(false)} />}
            {changeCash && <ChangeCashModal handleClose={() => setChangeCash(false)} currenctCash={activeClub.cash} refetch={refetchClubs} />}

            {displayMethod !== "history" && <div className="pagination-container">
                <Pagination size="small" color="primary" count={maxPages} page={page} onChange={(_e, v) => setPage(v)} />
            </div>}
            {!isPublic && <Button onClick={() => setImportModal(true)}>{translate["import_csv"]}</Button>}
        </div>
    )
}
