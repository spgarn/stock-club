import { Dispatch, SetStateAction, useEffect, useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const item = window.localStorage.getItem(key);
                setStoredValue(
                    item !== null && item != "undefined"
                        ? (JSON.parse(item) as T)
                        : initialValue
                );
                setLoading(false);
            } catch (error: unknown) {
                console.error(error);
            }
        }

    }, []);

    const setValue: Dispatch<SetStateAction<T>> = (value) => {
        try {
            setStoredValue(value);
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
        }
    };

    const removeValue: Dispatch<SetStateAction<T>> = () => {
        try {
            setStoredValue(initialValue);
            localStorage.removeItem(key);
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue, removeValue, loading] as const;
}

export default useLocalStorage;
