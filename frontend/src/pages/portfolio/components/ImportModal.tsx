import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import useClubs from "../../../hooks/useClubs";
import CSVParser from "../../../components/CSVParser";


export default function ImportModal({ handleClose, refetch }: { handleClose: () => void; refetch: () => void; }) {
    const { clubId } = useClubs();

    // const onSubmit: SubmitHandler<SellChunk> = async (data: SellChunk) => {
    //     setLoading(true);
    //     try {
    //         const res = await api.put<unknown>
    //             ("/stocks/sellportion/club/" + clubId, {
    //                 id: stock.id,
    //                 ...data,
    //             }, {
    //                 headers: {
    //                     "Access-Control-Allow-Origin": "*"
    //                 },
    //                 withCredentials: true
    //             });
    //         const resData = res.data;
    //         toast.success(translate["stock_updated_success"]);
    //         refetch();
    //         handleClose();
    //         console.log(resData);
    //     } catch (err) {
    //         if (axios.isAxiosError(err)) {
    //             if (err.response?.data) {
    //                 toast.error(translateText(err.response?.data?.title, err.response?.data?.title));
    //             } else {
    //                 toast.error(err.message);
    //             }
    //         } else {
    //             toast.error(translate["something_went_wrong"])
    //         }
    //     }
    //     setLoading(false);
    // }
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
                {translate["import_csv"]}
            </BootstrapDialogTitle>

            <DialogContent>
                <CSVParser />
            </DialogContent>
        </Dialog>
    )
}
