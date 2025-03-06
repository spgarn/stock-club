import { AggregatedData } from "../components/ImportModal";

// Helper function to process each transaction row
export const processTransactions = (aggregated: AggregatedData[]): AggregatedData[] => {
    aggregated.forEach(item => {
        item.actions.forEach(action => {
            // If csv_import_price is non-zero, update the transaction type and calculate quantity
            if (action.csv_import_price && action.csv_import_price !== 0 && action.csv_import_transaction_type === "Övrigt") {
                action.csv_import_transaction_type = "Köp";
                if (action.csv_import_share_price && action.csv_import_share_price !== 0) {
                    // Calculate quantity as price divided by share price
                    action.csv_import_quantity = action.csv_import_price / action.csv_import_share_price;
                }
            }
        });
    });
    return aggregated;
}

export const stripBTA = (name: string) => {
    return name.replace(/\sBTA\b.*$/i, "").trim().toUpperCase();
}
export const mergeBTAIntoLatest = (aggregated: AggregatedData[]) => {
    // First, update the transaction rows
    aggregated = processTransactions(aggregated);

    // 1) Separate normal vs. BTA
    const btaItems: AggregatedData[] = [];
    const normalItemsByBaseName: Record<string, AggregatedData[]> = {};

    for (const item of aggregated) {
        const baseName = stripBTA(item.csv_import_name);
        // Does the name actually contain 'BTA'?
        const isBTA = /BTA/i.test(item.csv_import_name);


        if (isBTA) {
            btaItems.push(item);
        } else {
            // Group normal items by the base name
            if (!normalItemsByBaseName[baseName]) {
                normalItemsByBaseName[baseName] = [];
            }
            normalItemsByBaseName[baseName].push(item);
        }
    }

    // 2) For each baseName, find the normal item that has the *latest* date among its actions
    const latestNormalByBaseName: Record<string, AggregatedData | null> = {};
    for (const baseName in normalItemsByBaseName) {
        const items = normalItemsByBaseName[baseName];
        let bestItem: AggregatedData | null = null;
        let bestDate = new Date(0);

        for (const normalItem of items) {
            // find the maximum transaction date in that item’s actions
            const itemMaxDate = normalItem.actions.reduce((max, action) => {
                return action.csv_import_date > max ? action.csv_import_date : max;
            }, new Date(0));

            if (itemMaxDate > bestDate) {
                bestDate = itemMaxDate;
                bestItem = normalItem;
            }
        }


        latestNormalByBaseName[baseName] = bestItem;
    }

    // 3) Merge each BTA item into that baseName’s *latest* normal item
    //    Then remove the BTA item from the original array.
    for (let i = aggregated.length - 1; i >= 0; i--) {
        const item = aggregated[i];
        if (/BTA/i.test(item.csv_import_name)) {
            const baseName = stripBTA(item.csv_import_name);
            const latestNormal = latestNormalByBaseName[baseName];
            console.log(latestNormal)
            if (latestNormal) {
                // Merge actions
                latestNormal.actions.push(...item.actions);
                // Remove the BTA object from the array
                aggregated.splice(i, 1);
            }
        }
    }


    return aggregated;
}