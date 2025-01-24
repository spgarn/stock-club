import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import useClubs from "../../../hooks/useClubs";
import CSVParser, { CSVRow } from "../../../components/CSVParser";
import LineMatcher, { Connection } from "../../../components/LineMatcher";
import { useMemo, useState } from "react";

const STATIC_KEYS = ["csv_import_date", "csv_import_transaction_type", "csv_import_price", "csv_import_quantity", "csv_import_ISIN", "csv_import_diff"]
export default function ImportModal({ handleClose, refetch }: { handleClose: () => void; refetch: () => void; }) {
    const { clubId } = useClubs();
    const [table, setTable] = useState<{ keys: string[], values: string[], connections: Connection[], data: CSVRow[] }>({ keys: STATIC_KEYS, values: [], connections: [], data: [] })
    const { keys, values, connections, data } = table;
    console.log(connections);
    const parseData = (data: CSVRow[]) => {
        console.log(data);
        console.log(Object.keys(data[0]));
        setTable({ keys, values: Object.keys(data[0]), data: data, connections: [] })
    }

    const interpretedData = useMemo(() => {

    }, [table])

    return (
        <Dialog
            open={true}
            onClose={handleClose}
            aria-labelledby="Stock"
            aria-describedby="Stock"
            fullWidth
            maxWidth="md"
        >
            <BootstrapDialogTitle
                id="edit_alert-dialog-title"
                onClose={() => handleClose()}
            >
                {translate["import_csv"]}
            </BootstrapDialogTitle>

            <DialogContent>
                <CSVParser parseData={parseData} />
                {/* <Container sx={{ height: 300 }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        defaultEdgeOptions={edgeOptions}
                        fitView
                    >
                        <Background />
                        <Controls />
                        <MiniMap />
                    </ReactFlow>
                </Container> */}
                <LineMatcher keys={keys} values={values} connections={connections} setConnections={(connections) => setTable(t => ({ ...t, connections }))} />
            </DialogContent>
        </Dialog>
    )
}
