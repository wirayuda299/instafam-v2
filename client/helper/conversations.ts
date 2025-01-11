import { RequestConfig, SERVER_URL } from "@/constants";
import { UserConversation } from "@/types";

export async function getConversation(userSession: string): Promise<UserConversation[]> {
    try {
        const requestConf = new RequestConfig('GET')

        const res = await fetch(`${SERVER_URL}/conversations?userId=${userSession}`, requestConf.toRequestInit());

        if (!res.ok) throw new Error('Failed to fetch conversation');

        const conversation = await res.json();
        return conversation;
    } catch (error) {
        throw error;
    }
}

export async function getPersonalMessage(userId: string) {
    try {
        const requestConf = new RequestConfig('GET')

        const res = await fetch(`${SERVER_URL}/conversations/messages?userId=${userId}`, requestConf.toRequestInit());

        if (!res.ok) throw new Error('Failed to fetch personal messages');

        const messages = await res.json();
        return messages;
    } catch (e) {
        throw e;
    }
}

