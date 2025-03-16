import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { translate } from "../../../i18n";

type Options = "active_stocks" | "history" ;
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
      <ToggleButton size="small" value="history">
        {translate["history"]}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
