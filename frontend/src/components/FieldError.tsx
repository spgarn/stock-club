import { Typography } from "@mui/material";
export default function FieldError({ error }: { error: string }) {
    return (
        <Typography className='error'>{error}</Typography>
    )
}
