import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { translate } from "../../../i18n";

type Options = "active_stocks" | "sold_stocks" | "all_stocks";
type IProps = {
  displayMethod: Options;
  setDisplayMethod: (v: Options) => void;
};

export default function DisplayToggle({
  displayMethod,
  setDisplayMethod,
}: IProps) {
  return (
    <ToggleButtonGroup
      color="primary"
      value={displayMethod}
      exclusive
      onChange={(_v, r) => setDisplayMethod(r)}
      aria-label="Display Type"
      size="small"
    >
      <ToggleButton size="small" value="active_stocks">
        {translate["active_stocks"]}
      </ToggleButton>
      <ToggleButton size="small" value="sold_stocks">
        {translate["sold_stocks"]}
      </ToggleButton>
      <ToggleButton size="small" value="all_stocks">
        {translate["all_stocks"]}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
