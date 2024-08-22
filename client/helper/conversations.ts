import { ApiRequest } from "@/utils/api";

const api = new ApiRequest();

type UserConversation = {
    conversationId: string;
    conversationCreatedAt: string;
    senderId: string;
    senderUsername: string;
    senderImage: string;
    recipientId: string;
    recipientUsername: string;
    recipientImage: string;
};

export async function getConversation(userSession: string) {
    try {
        return await api.getData<UserConversation[]>(
            `/conversations?userId=${userSession}`,
        );
    } catch (error) {
        throw error;
    }
}

export async function getPersonalMessage(userId: string) {
    try {
        return await api.getData(`/conversations/messages?userId=${userId}`);
    } catch (e) {
        throw e;
    }
}
