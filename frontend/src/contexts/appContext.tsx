
import React, {
    createContext,
    useState,
    useEffect,
} from "react";
import { toast } from "react-toastify";
import { translate } from "../i18n";

export type User = {
    email: string;
    userName: string;
}

interface AppProviderProps {
    children: React.ReactNode;
}

interface AppContextProps {
    login: (user: User) => void;
    logout: () => void;
    user: User | null | undefined;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);
const key = "auth-user-coolfashion";
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<null | undefined | User>(undefined);

    useEffect(() => {
        console.log("Retrieving");
        if (typeof window === "undefined") {
            return;
        }
        console.log("A");
        try {
            const item = window.localStorage.getItem(key);
            console.log("B");
            const userFromStorage = item !== null && item != "undefined"
                ? (JSON.parse(item) as User)
                : null
            setUser(
                userFromStorage
            );
        } catch (err: unknown) {
            console.log(err);
            return;
        }
    }, [])

    const login = (user: User) => {
        //axios post req here
        localStorage.setItem(key, JSON.stringify(user));
        setUser(user);
        // toast.success("Successfully logged in!");


    };

    const logout = () => {
        //axios post req here
        localStorage.setItem(key, JSON.stringify(null));
        //queryClient.refetchQueries();
        setUser(null);
        toast.success(translate["logged_out"]);
    };
    return (
        <AppContext.Provider
            value={{
                login,
                logout,
                user,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};