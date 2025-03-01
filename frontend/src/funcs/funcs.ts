import { queryClient } from "../main";

export const formatCurrency = (amount: string | number, isShowingCurrency = false, maxFraction = 2, withPlus = false) => {
    const value = !amount ? 0 : +amount;

    return (withPlus && value > 0 ? "+" : "") + new Intl.NumberFormat('sv-SE', {
        style: isShowingCurrency ? 'currency' : 'decimal',
        currency: 'SEK',
        minimumFractionDigits: maxFraction < 2 ? maxFraction : 2,
        maximumFractionDigits: maxFraction,
    }).format(value);
}
export const refetchClubAndMeeting = () => {
    queryClient.invalidateQueries({ queryKey: ['club-details'] });
    queryClient.invalidateQueries({ queryKey: ['club-meeting'] });
}

//Take any number-ish type and make it js number
export const convertToNumber = (num: string | number) => {
    return Number(String(num).replace(/\s/g, "").replace(",", "."))
}


export const convertCurrency = (
    price: number,
    currency: string,
    reverseRates: { EUR?: number; USD?: number; GBP?: number }
): number => {
    switch (currency) {
        case "USD":
            return price * (reverseRates.USD ?? 1);
        case "EUR":
            return price * (reverseRates.EUR ?? 1);
        case "GBP":
            return price * (reverseRates.GBP ?? 1);
        default:
            return price;
    }
};