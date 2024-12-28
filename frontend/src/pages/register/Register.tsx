import { Button, TextField, Typography } from "@mui/material"
import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { base_url } from "../../api";
import ErrorMessage from "../../components/ErrorMessage";
import { useAppContext } from "../../contexts/useAppContext";
import { translate, translateText } from "../../i18n";
type Inputs = {
    email: string;
    password: string;
    password2: string;
    // userName: string;
    firstName: string;
    lastName: string;
}

//Filter by keywords to extract error
const matching = (keywords: string[], match: string) => {
    return keywords.filter(keyword => match.includes(keyword));
}
const extractErrors = (errors: { [key: string]: string[] }, keywords: string[]) => {

    return Object.entries(errors).reduce((prev, [errkey, errvalues]) => {
        if (matching(keywords, errkey).length > 0 && errvalues.length >= 0) {
            prev.push({ key: errkey, value: errvalues[0] }); //Grab first
        }
        return prev;
    }, [] as { key: string; value: string }[])
}
export default function Register() {
    const { login } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [errorTitle, setErrorTitle] = useState<string>("");
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError
    } = useForm<Inputs>();
    console.log(watch("email"))
    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        setErrorTitle("");
        if (data.password != data.password2) {
            setError("password2", {
                message: translate["password_match"],
                type: "pattern"
            })
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post<unknown>
                (base_url + "/register", data, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;

            //We have registered and can now login.
            if (resData) {
                try {
                    const res = await axios.post<unknown>
                        (base_url + "/login?useCookies=true", data, {
                            headers: {
                                "Access-Control-Allow-Origin": "*"
                            },
                            withCredentials: true
                        });
                    const resData = res.data;
                    toast.success(translate["register_success"]);
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
            }

        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data) {
                    const errData = err.response?.data as { type: string; title: string; status: number; errors: { [key: string]: string[] } }
                    const errText = translateText(errData.title, errData.title)
                    setErrorTitle(errText);
                    toast.error(errText);

                    //Loop over all errors
                    const emailErrors = extractErrors(errData.errors, ["Email", "UserName"]);
                    if (emailErrors.length > 0) {
                        setError("email", {
                            message: translateText(emailErrors[0].key, emailErrors[0].value),
                            type: "value"
                        })
                    }

                    const passErrors = extractErrors(errData.errors, ["Password"]);
                    if (passErrors.length > 0) {
                        setError("password", {
                            message: translateText(passErrors[0].key, passErrors[0].value),
                            type: "pattern"
                        })
                    }

                    // const userNameErrors = extractErrors(errData.errors, ["UserName"]);
                    // if (userNameErrors.length > 0) {
                    //     setError("userName", {
                    //         message: translateText(userNameErrors[0].key, userNameErrors[0].value),
                    //         type: "pattern"
                    //     })
                    // }

                    const firstNameErrors = extractErrors(errData.errors, ["FirstName"]);
                    if (firstNameErrors.length > 0) {
                        setError("firstName", {
                            message: translateText(firstNameErrors[0].key, firstNameErrors[0].value),
                            type: "pattern"
                        })
                    }

                    const lastNameErrors = extractErrors(errData.errors, ["LastName"]);
                    if (lastNameErrors.length > 0) {
                        setError("lastName", {
                            message: translateText(lastNameErrors[0].key, lastNameErrors[0].value),
                            type: "pattern"
                        })
                    }

                } else {
                    setErrorTitle(err.message);
                    toast.error(err.message);
                }
            } else {
                setErrorTitle(translate["something_went_wrong"]);
                toast.error(translate["something_went_wrong"])
            }
        }
        setLoading(false);
    }
    return (
        <div className='auth-container'>

            <form className='auth-panel box' onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h4">{translate["register"]}</Typography>
                <ErrorMessage error={errorTitle} />
                {/* <TextField
                    fullWidth={true}
                    error={!!errors.userName}
                    id="username-auth"
                    label={translate["enter_username"]}
                    type="text"
                    variant="standard"
                    helperText={errors.userName ? errors?.userName.message : " "}
                    {...register("userName", { required: true })}
                /> */}
                <TextField
                    fullWidth={true}
                    error={!!errors.firstName}
                    id="firstname-auth"
                    label={translate["enter_firstname"]}
                    type="text"
                    variant="standard"
                    helperText={errors.firstName ? errors?.firstName.message : " "}
                    {...register("firstName", { required: true })}
                />
                <TextField
                    fullWidth={true}
                    error={!!errors.lastName}
                    id="lastname-auth"
                    label={translate["enter_lastname"]}
                    type="text"
                    variant="standard"
                    helperText={errors.lastName ? errors?.lastName.message : " "}
                    {...register("lastName", { required: true })}
                />
                <TextField
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
                    fullWidth={true}
                    error={!!errors.password}
                    id="pass-auth"
                    label={translate["enter_pass"]}
                    type="password"
                    variant="standard"
                    helperText={errors.password ? errors?.password.message : " "}
                    {...register("password", { required: true })}
                />
                <TextField
                    fullWidth={true}
                    error={!!errors.password2}
                    id="pass2-auth"
                    label={translate["reenter_pass"]}
                    type="password"
                    variant="standard"
                    helperText={errors.password2 ? errors?.password2.message : " "}
                    {...register("password2", { required: true })}
                />

                <Typography>{translate["already_have_account"]} <NavLink to="/login">{translate["login_here"]}</NavLink></Typography>
                <div>
                    <Button type="submit" variant="contained" disabled={loading}>{loading ? translate["registering"] : translate["register"]}</Button>
                </div>
            </form>
        </div>
    )
}
