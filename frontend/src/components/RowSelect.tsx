import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { translate } from "../i18n";

export default function RowSelect({
    value,
    changeValue,
    options = [5, 10, 20, 50, 100, 250, 10000],
}: {
    value: number;
    changeValue: (newValue: number) => void;
    options?: number[];
}) {
    return (
        <div>
            <FormControl size="small">
                <InputLabel id="demo-simple-select-label">{translate["rows"]}</InputLabel>
                <Select
                    labelId="show-rows"
                    id="show-rows-select"
                    value={value}
                    label="Rows"
                    onChange={(e) => changeValue(Number(e.target.value))}
                >
                    {options.map((count) => (
                        <MenuItem value={count} key={count}>
                            {count >= 1000
                                ? `${Math.round(count / 1000)}K`
                                : count}{" "}
                            {translate["rows"]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
