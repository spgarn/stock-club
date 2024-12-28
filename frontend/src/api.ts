import axios from "axios";
export const base_url = import.meta.env.VITE_BASE_URL;

export type Club = {
    id: number;
    name: string;
}

export type Meeting = {
    id: number;
    name: string;
    description: string;
    meetingTime: Date;
    location: string;
    endedAt: Date | null;
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
    title: string;
    description: string;
    createdAt: Date;
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
    id: number;
    stockName: string;
    investedAt: Date;
    buyPrice: number;
    amount: number;
    currentPrice: number;
    sold: boolean;
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
    const response = await axios.get<User[]>(
        base_url + '/usermanagement/all_in_club/' + clubId,
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
    const response = await axios.get<User[]>(
        base_url + '/usermanagement/all_not_in_club/' + clubId,
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
    const response = await axios.get<Decisions[]>(
        base_url + '/decisions/all',
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}


export const getTemplates = async () => {
    const response = await axios.get<Templates[]>(
        base_url + '/templates/all',
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}


export const getStocks = async () => {
    const response = await axios.get<StockHoldings[]>(
        base_url + '/stocks/all',
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
    const response = await axios.get<MeetingExtended>(
        base_url + '/meeting/get/' + id,
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
    const response = await axios.get<ClubDetails>(
        base_url + '/club/' + id + "/info",
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
    const response = await axios.get<Club[]>(
        base_url + '/club',
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
    const response = await axios.get<User>(
        base_url + '/user/info',
        {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        }
    )
    return response.data;
}