import axios from "axios";
import { Transaction } from "./pages/portfolio/components/history/components/Transactions";

// Create an axios instance with default config
const api = axios.create({
    baseURL: '/api',
    // You can add other default configurations here
    headers: {
        'Content-Type': 'application/json'
    }
});

// Export it for use in other files
export default api;

export type Club = {
    id: number;
    name: string;
    cash: number,
    publicInvestments: boolean;
}
export type MeetingDecisionsRate = {
    id: number;
    userId: string;
}
export type MeetingDecisions = {
    id: number;
    meeting: Meeting;
    title: string;
    expiresAt: Date;
    createdAt: Date;
    completed: boolean | null;
    meetingsDecisionsUpvotes: MeetingDecisionsRate[];
    meetingsDecisionsDownvotes: MeetingDecisionsRate[];
    user: User;
}

export type Meeting = {
    id: number;
    name: string;
    description: string;
    meetingTime: Date;
    location: string;
    endedAt: Date | null;
    attendees: {
        userId: string;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        userName: string;
        admin: boolean;
        votingPower: number
    }[];
    decliners: {
        userId: string;
        votingPowerGivenTo: string;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        userName: string;
        admin: boolean;
    }[];
    meetingDecisions: MeetingDecisions[]
}

export type MeetingChat = {
    id: number;
    createdAt: Date;
    message: string;
    updatedAt: Date,
    user: User
}

export type MeetingExtended = Meeting & {
    agenda: string;
    meetingProtocol: string;
    meetingChats: MeetingChat[]
}

export type CurrencyRate = {
    id: number,
    name: string,
    rate: number
}

export type User = {
    id: string;
    userName: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
    admin: boolean;
}

export type MeetingSuggestionRate = {
    id: number;
    userId: string;
}

export type MeetingSuggestion = {
    id: number;
    meeting: Meeting;
    title: string;
    description: string;
    createdAt: Date;
    completed: boolean | null;
    meetingsSuggestionsUpvotes: MeetingSuggestionRate[];
    meetingsSuggestionsDownvotes: MeetingSuggestionRate[];
    user: User;
}


export type ClubDetails = Club & {
    meetings: Meeting[],
    users: User[],
    meetingsSuggestions: MeetingSuggestion[]
}

export type StockHoldings = {
    sellPrice: number | null;
    id: number;
    stockName: string;
    investedAt: Date;
    buyPrice: number;
    amount: number;
    currentPrice: number;
    openingPrice: number;
    sold: boolean;
    soldAt: Date | null;
    overridePrice: number | null;
    avanzaName: string;
    currency: string;
}

export type Templates = {
    id: number;
    title: string;
    markdown: string;
    createdAt: Date;
    updatedAt: Date;
    club: Club;
}

export type Decisions = {
    id: number;
    title: string;
    markdown: string;
    createdAt: Date;
    updatedAt: Date;
    club: Club;
}
export const getUsersInClub = async (clubId: number) => {
    const response = await api.get<User[]>(
        '/usermanagement/all_in_club/' + clubId,
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}

export const getUsersNotInClub = async (clubId: number) => {
    const response = await api.get<User[]>(
        '/usermanagement/all_not_in_club/' + clubId,
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}

export const getDecisions = async () => {
    const response = await api.get<Decisions[]>(
        '/news/all',
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}

export const getEmails = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.get<any[]>(
        '/emails',
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}


export const getTemplates = async (clubId: number) => {
    const response = await api.get<Templates[]>(
        '/templates/all/' + clubId,
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}


export const getStocks = async (clubId: number) => {
    const response = await api.get<StockHoldings[]>(
        `/stocks/all/${clubId}`,
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}

export const getTransactions = async (clubId: number) => {
    const response = await api.get<Transaction[]>(
        `/transactions/all/${clubId}`,
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}

// export const getPing = async () => {
//     const response = await axios.get<string>(
//         base_url + '/home',
//         {
//             headers: {
//                 "Access-Control-Allow-Origin": "*"
//             },
//             withCredentials: true
//         }
//     )
//     return response.data;
// }

export const getMeeting = async (id: number) => {
    const response = await api.get<MeetingExtended>(
        '/meeting/get/' + id,
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}

export const getClubDetails = async (id: number) => {
    const response = await api.get<ClubDetails>(
        '/club/' + id + "/info",
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}

export const getClubs = async () => {
    const response = await api.get<Club[]>(
        '/club',
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}
export const getUser = async () => {
    const response = await api.get<User>(
        '/user/info',
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}
export const getUserById = async (id: string | undefined) => {
    if (!id) return null;
    const response = await api.get<User>(
        '/user/' + id + '/info',
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}

export const getCurrencyRates = async () => {
    const response = await api.get<CurrencyRate[]>(
        '/currency/getrates',
        { withCredentials: true }
    );
    const reversedRates = response.data.map(currency => currency.rate ? { ...currency, rate: 1 / currency.rate } : currency);

    return reversedRates;
};