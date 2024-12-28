

import {
    HubConnectionBuilder,
    LogLevel,
    HttpTransportType,
    HubConnection,
} from "@microsoft/signalr"
import { useEffect, useState } from "react";
import { MeetingChat } from "../api";

export default function useMeetingSocket(meetingId: number, clubId: number, getAgenda: (m: string) => void, getMeetingProtocol: (m: string) => void, getChat: (chat: MeetingChat) => void, removeChat: (id: number) => void, refetch: () => void) {

    const [connection, setConnection] = useState<HubConnection | null>(null);
    const getMessage = (message: string) => console.log(message);
    // const getAgenda = (message: string) => console.log("Agenda:", message);
    // const getMeetingProtocol = (message: string) => console.log("Meeting Protocol:", message);


    useEffect(() => {
        console.log("Setting up socket...")
        let socketConnection: HubConnection | null = null;
        const configSocket = async () => {

            socketConnection = new HubConnectionBuilder()
                .configureLogging(LogLevel.Debug)
                .withUrl("/api/meetingHub", {
                    skipNegotiation: true,
                    transport: HttpTransportType.WebSockets,
                })
                .build();
            socketConnection.on("ping", getMessage);
            socketConnection.on("agenda", getAgenda);
            socketConnection.on("meetingProtocol", getMeetingProtocol);
            socketConnection.on("chat", getChat);
            socketConnection.on("chatRemove", removeChat);
            socketConnection.on("liveRefetch", refetch);
            await socketConnection.start();

            //Join room
            await socketConnection.invoke("JoinRoom", clubId, meetingId);

            setConnection(socketConnection);
        };
        if (meetingId && clubId)
            configSocket();

        return () => {
            socketConnection?.invoke("LeaveRoom", meetingId);
            // socketConnection?.off("ping", getMessage);
            // socketConnection?.off("agenda", getAgenda);
            // socketConnection?.off("meetingProtocol", getMeetingProtocol);
            // socketConnection?.off("chat", getChat);
            // socketConnection?.off("chatRemove", removeChat);
            // socketConnection?.off("liveRefetch", refetch);
            // socketConnection?.stop();
        }
    }, [meetingId, clubId]);

    // useEffect(() => {
    //     console.log("Connection state:", connection?.state); // Log state
    //     if (connection && connection.state === "Connected") {
    //         console.log("Registering event handlers");

    //         const getMessage = (message: string) => console.log(message);
    //         const getAgenda = (message: string) => console.log("Agenda:", message);
    //         const getMeetingProtocol = (message: string) => console.log("Meeting Protocol:", message);

    //         connection.on("ping", getMessage);
    //         connection.on("agenda", getAgenda);
    //         connection.on("meetingProtocol", getMeetingProtocol);

    //         // Cleanup listeners on component unmount or dependency change
    //         // return () => {
    //         //     connection.off("ping", getMessage);
    //         //     connection.off("agenda", getAgenda);
    //         //     connection.off("meetingProtocol", getMeetingProtocol);
    //         // };
    //     }
    // }, [connection]);

    const sendAgenda = (text: string) => {
        if (connection) {
            connection.invoke("Agenda", meetingId, text);
        } else {
            console.log("Connection not established");
        }
    }

    const sendMeetingProtocol = (text: string) => {
        if (connection) {
            connection.invoke("MeetingProtocol", meetingId, text);
        } else {
            console.log("Connection not established");
        }
    }

    const sendChat = (message: string) => {
        if (connection) {
            connection.invoke("SendChat", clubId, meetingId, message);
        } else {
            console.log("Connection not established");
        }
    }

    const removeMessage = (messageId: number) => {
        if (connection) {
            connection.invoke("RemoveChat", clubId, meetingId, messageId);
        } else {
            console.log("Connection not established");
        }
    }
    const liveRefetch = () => {
        if (connection) {
            connection.invoke("LiveRefetch", clubId, meetingId);
        } else {
            console.log("Connection not established");
        }
    }


    return { connection, sendAgenda, sendMeetingProtocol, sendChat, removeMessage, liveRefetch }
}
