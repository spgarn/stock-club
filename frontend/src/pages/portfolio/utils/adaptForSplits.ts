import { Action, AggregatedData } from "../components/modals/ImportModal";




export const adaptForSplits = (aggregated: AggregatedData[]) => {
    // Process each aggregated item independently
    return aggregated.map((item) => {
        // First, sort the actions in descending order by date.
        const sortedActions = [...item.actions].sort(
            (a, b) =>
                new Date(b.csv_import_date).getTime() -
                new Date(a.csv_import_date).getTime()
        );

        // Group "Övrigt" actions by date.
        const ovrigtByDate: { [date: string]: Action[] } = {};
        sortedActions.forEach((action) => {
            if (action.csv_import_transaction_type === "Övrigt") {
                // Use the ISO string of the date as key.
                const dateKey = new Date(action.csv_import_date).toISOString();
                if (!ovrigtByDate[dateKey]) {
                    ovrigtByDate[dateKey] = [];
                }
                ovrigtByDate[dateKey].push(action);
            }
        });

        let splitFactor: number | null = null;

        // Iterate over each group of "Övrigt" actions.
        Object.keys(ovrigtByDate).forEach((dateKey) => {
            const actionsForDate = ovrigtByDate[dateKey];
            if (actionsForDate.length === 2) {
                // Calculate total stocks from non-"Övrigt" actions (i.e. "Köp" and "Sälj")
                // that occurred BEFORE this date.
                let totalStocks = 0;
                sortedActions.forEach((action) => {
                    const actionTime = new Date(action.csv_import_date).getTime();
                    const groupTime = new Date(dateKey).getTime();
                    if (
                        actionTime < groupTime &&
                        (action.csv_import_transaction_type === "Köp" ||
                            action.csv_import_transaction_type === "Sälj")
                    ) {
                        if (action.csv_import_transaction_type === "Köp") {
                            totalStocks += action.csv_import_quantity;
                        } else if (action.csv_import_transaction_type === "Sälj") {
                            totalStocks -= action.csv_import_quantity;
                        }
                    }
                });

                // From the two "Övrigt" actions, assume the one with the smaller quantity
                // represents the new shares from the split.
                const quantities = actionsForDate.map((a) => a.csv_import_quantity);
                const newShares = Math.min(...quantities);
                const oldShares = Math.max(...quantities);

                // Check if the larger "Övrigt" quantity matches the total stocks before the split.
                // (If so, the split factor can be computed.)
                if (oldShares === totalStocks && newShares > 0) {
                    splitFactor = totalStocks / newShares;
                }
            }
        });

        // If a valid split factor is found, update all "Köp" actions accordingly.
        const updatedActions = sortedActions.map((action) => {
            if (action.csv_import_transaction_type === "Köp" && splitFactor !== null) {
                return {
                    ...action,
                    csv_import_quantity: action.csv_import_quantity / splitFactor,
                };
            }
            return action;
        });

        return {
            ...item,
            actions: updatedActions,
        };
    });
};