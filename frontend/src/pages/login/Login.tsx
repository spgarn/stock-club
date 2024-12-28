import { Button, TextField, Typography } from "@mui/material"
import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import api from "../../api";
import { useAppContext } from "../../contexts/useAppContext";
import { translate, translateText } from "../../i18n";
type Inputs = {
    email: string;
    password: string;
}
export default function Login() {
    const { login } = useAppContext();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        setLoading(true);
        try {
            const res = await api.post<unknown>
                ("/login?useCookies=true", data, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["login_success"]);
            login({ email: data.email, userName: data.email });
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
            <form className='auth-panel box' onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h4">{translate["login"]}</Typography>
                <TextField
                    autoComplete="current-email"
                    fullWidth={true}
                    error={!!errors.email}
                    id="email-auth"
                    label={translate["enter_email"]}
                    type="email"
                    variant="standard"
                    helperText={errors.email ? errors?.email.message : " "}
                    {...register("email", { required: true })}
                />
                <TextField
                    autoComplete="current-password"
                    fullWidth={true}
                    error={!!errors.password}
                    id="pass-auth"
                    label={translate["enter_pass"]}
                    type="password"
                    variant="standard"
                    helperText={errors.password ? errors?.password.message : " "}
                    {...register("password", { required: true })}
                />
                <Typography>{translate["dont_have_account"]} <NavLink to="/register">{translate["register_here"]}</NavLink></Typography>
                <div>
                    <Button type="submit" variant="contained" disabled={loading}>{loading ? translate["loggingIn"] : translate["login"]}</Button>
                </div>
            </form>
        </div>
    )
}
