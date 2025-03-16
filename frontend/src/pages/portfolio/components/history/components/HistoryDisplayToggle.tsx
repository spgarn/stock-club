import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { translate } from "../../../../../i18n";

export type HistoryOptions = "sold_stocks" | "transactions";

type HistoryDisplayToggleProps = {
  displayMethod: HistoryOptions;
  setDisplayMethod: (v: HistoryOptions) => void;
};

export default function HistoryDisplayToggle({
  displayMethod,
  setDisplayMethod,
}: HistoryDisplayToggleProps) {
  return (
    <ToggleButtonGroup
      color="primary"
      value={displayMethod}
      exclusive
      onChange={(_e, r) => setDisplayMethod(r)}
      aria-label="History Display Type"
      size="small"
    >
      <ToggleButton size="small" value="sold_stocks">
        {translate["sold_stocks"]}
      </ToggleButton>
      <ToggleButton size="small" value="transactions">
        {translate["transactions"]}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}