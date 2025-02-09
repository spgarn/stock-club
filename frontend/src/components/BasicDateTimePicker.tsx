// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs, { Dayjs } from "dayjs";
import { DateOrTimeView } from "@mui/x-date-pickers/models";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
export default function BasicDateTimePicker({
    value,
    onChange,
    label,
    error,
    // views = ['year', 'day', 'hours', 'minutes']
}: {
    value: Dayjs | null;
    onChange: (newDate: Dayjs | null) => void;
    label: string;
    error?: string | null;
    views?: DateOrTimeView[]
}) {
    return (
        <div className="pt-1">
            <p className="error text-right">{!!error && error}</p>
            {/* <div className="align-left">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        orientation="landscape"
                        label={label}
                        // sx={{ padding: 0 }}
                        value={value}
                        onChange={(e) => onChange(e)}
                        views={views}
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                    />
                </LocalizationProvider>
            </div> */}
            <Box>
                <TextField
                    type="datetime-local"
                    onChange={(e) => {
                        // e.target.value will contain the selected date/time
                        onChange(dayjs(e.target.value))
                    }}
                    // Format the dayjs value to ISO string and slice to remove seconds/timezone
                    value={value ? value.format('YYYY-MM-DDTHH:mm') : ''}
                    label={label}
                />
            </Box>

        </div>
    );
}
