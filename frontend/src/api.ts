import axios from "axios";

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
    publicInvestments: boolean;
}

export type Meeting = {
    id: number;
    name: string;
    description: string;
    meetingTime: Date;
    location: string;
    endedAt: Date | null;
    attendees: User[];
    decliners: User[];
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

export type FxRatesApiResponse = {
    success: boolean;
    terms: string;
    privacy: string;
    timestamp: number;
    date: string;
    base: string;
    rates: {
      EUR: number;
      GBP: number;
      USD: number;
    };
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
        '/decisions/all',
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
    const response = await api.get<FxRatesApiResponse>(
        '/stocks/currency',
        { withCredentials: true }
    );
    console.log(response)
    return response.data;
};
