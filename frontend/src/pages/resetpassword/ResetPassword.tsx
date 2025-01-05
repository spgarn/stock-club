import { Button, TextField, Typography } from "@mui/material"
import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../api";
import { translate, translateText } from "../../i18n";
import { useLocation, useNavigate } from "react-router-dom";
type Inputs = {
    password: string;
    password2: string;
}
export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    // Create an instance of URLSearchParams to parse the query string
    const queryParams = new URLSearchParams(location.search);

    // Access query parameters by key
    const code = queryParams.get('code');
    const mail = queryParams.get('mail');
    console.log(code, mail);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm<Inputs>();
    const validatePasswordsMatch = (value: string) => {
        const password = getValues('password'); // Get the value of the password field
        return value === password || translate["password_match"]; // Custom error message
    };
    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        setLoading(true);
        try {
            const res = await api.post<unknown>
                ("/resetPassword?useCookies=true", {
                    email: mail,
                    resetCode: code,
                    newPassword: data.password
                }, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["reset_success"]);
            navigate("/login");
            console.log(resData);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data) {
                    toast.error(translateText(err.response?.data?.title, err.response?.data?.title));
                } else {
                    toast.error(err.message);
                }
            } else {
                toast.error(translate["something_went_wrong"])
            }
        }
        setLoading(false);
    }
    return (
        <div className='auth-container'>
            <form autoComplete="on" className='auth-panel box' onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h4">{translate["reset_password"]}</Typography>
                <TextField
                    autoComplete="new-password"
                    fullWidth
                    error={!!errors.password}
                    id="pass-auth"
                    label={translate["enter_pass"]}
                    type="password"
                    variant="standard"
                    helperText={errors.password ? errors.password.message : " "}
                    {...register("password", { required: translate["password_required"] })}
                />
                <TextField
                    fullWidth
                    error={!!errors.password2}
                    id="pass2-auth"
                    label={translate["reenter_pass"]}
                    type="password"
                    variant="standard"
                    helperText={errors.password2 ? errors.password2.message : " "}
                    {...register("password2", {
                        required: "Please re-enter your password",
                        validate: validatePasswordsMatch // Custom validation function
                    })}
                />
                <div>
                    <Button type="submit" variant="contained" disabled={loading}>{loading ? translate["confirming"] : translate["confirm"]}</Button>
                </div>
            </form>
        </div>
    )
}
