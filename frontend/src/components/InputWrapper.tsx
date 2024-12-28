import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
export type IProps = {
    error: string | undefined;
    required: boolean;
    children: React.ReactNode
    title: string;
    hint?: string;
    aria?: string;
}
export default function InputWrapper({ error, required, children, title, hint, aria }: IProps) {
    return (
        <FormControl
            error={!!error}
            required={required}
        >
            <InputLabel>{error ?? title}</InputLabel>
            {children}
            <FormHelperText id={aria}>{hint}</FormHelperText>
        </FormControl>
    )
}
