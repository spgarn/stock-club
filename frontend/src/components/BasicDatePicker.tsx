import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function BasicDatePicker({
    value,
    onChange,
    label,
    error,
}: {
    value: Dayjs | null;
    onChange: (newDate: Dayjs | null) => void;
    label: string;
    error?: string | null;
}) {
    return (
        <div className="pt-1">
            <p className="error text-right">{!!error && error}</p>
            <div className="align-left">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={label}
                        value={value}
                        onChange={(e) => onChange(e)}
                        sx={{ padding: "inherit", fontSize: "inherit" }}
                    />
                </LocalizationProvider>
            </div>
        </div>
    );
}
