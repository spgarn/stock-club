import { Action } from "../components/modals/ImportModal";


export const calculateRemainingBuyCostAndDate = (
    buys: Action[],
    totalSellQuantity: number
): { remainingCost: number; remainingBuyDate: Date } => {
    if (buys.length === 0) {
        return { remainingCost: 0, remainingBuyDate: new Date() };
    }
    // Sort buys by date ascending (FIFO)
    const sortedBuys = [...buys].sort(
        (a, b) =>
            new Date(a.csv_import_date).getTime() - new Date(b.csv_import_date).getTime()
    );
    // If there are no sells, sum the cost of all buy transactions
    if (totalSellQuantity === 0) {
        const totalCost = sortedBuys.reduce(
            (acc, buy) => acc + buy.csv_import_price,
            0
        );
        // You might choose to use the most recent buy date, or another date as needed.
        const lastBuyDate = sortedBuys[sortedBuys.length - 1].csv_import_date;
        return { remainingCost: totalCost, remainingBuyDate: lastBuyDate };
    }
    // Existing FIFO matching logic when there are sells
    let remainingSell = totalSellQuantity;
    let remainingCost = 0;
    let remainingBuyDate: Date = sortedBuys[sortedBuys.length - 1].csv_import_date; // fallback
    for (const buy of sortedBuys) {
        if (remainingSell >= buy.csv_import_quantity) {
            // This buy is fully offset by sells.
            remainingSell -= buy.csv_import_quantity;
        } else {
            // Partially offset: this buy provides the remaining shares.
            const remainingQty = buy.csv_import_quantity - remainingSell;
            const unitCost = buy.csv_import_price / buy.csv_import_quantity;
            remainingCost += unitCost * remainingQty;
            remainingBuyDate = buy.csv_import_date;
            remainingSell = 0;
            break;
        }
    }
    return { remainingCost, remainingBuyDate };
};

export const calculateSoldCostAndDate = (
    buys: Action[],
    sellQty: number
): { soldCost: number; lastSellBuyDate: Date } => {
    if (buys.length === 0) {
        // Return defaults if no buy actions are provided.
        return { soldCost: 0, lastSellBuyDate: new Date() };
    }
    const sortedBuys = [...buys].sort(
        (a, b) =>
            new Date(a.csv_import_date).getTime() - new Date(b.csv_import_date).getTime()
    );
    let remainingSell = sellQty;
    let soldCost = 0;
    let lastSellBuyDate: Date = sortedBuys[sortedBuys.length - 1].csv_import_date;
    for (const buy of sortedBuys) {
        if (remainingSell <= 0) break;
        if (remainingSell >= buy.csv_import_quantity) {
            soldCost += buy.csv_import_price;
            lastSellBuyDate = buy.csv_import_date;
            remainingSell -= buy.csv_import_quantity;
        } else {
            const unitCost = buy.csv_import_price / buy.csv_import_quantity;
            soldCost += unitCost * remainingSell;
            lastSellBuyDate = buy.csv_import_date;
            remainingSell = 0;
            break;
        }
    }
    return { soldCost, lastSellBuyDate };
};