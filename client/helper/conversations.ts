
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
const serverUrl=process.env.SERVER_URL


export async function getConversation(userSession: string):Promise<UserConversation[]> {
    try {
        const res = await fetch(`${serverUrl}/api/v1/conversations?userId=${userSession}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });

        if (!res.ok) throw new Error('Failed to fetch conversation');

        const conversation = await res.json();
        return conversation;
    } catch (error) {
        throw error;
    }
}

export async function getPersonalMessage(userId: string) {
    try {
        const res = await fetch(`${serverUrl}/api/v1/conversations/messages?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });

        if (!res.ok) throw new Error('Failed to fetch personal messages');

        const messages = await res.json();
        return messages;
    } catch (e) {
        throw e;
    }
}

