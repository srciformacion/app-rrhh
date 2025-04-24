
import { ChatMessage, mockChatMessages, User } from '../data/mockData';

export const chatService = {
  // Get all messages between two users
  getConversation: (user1Id: string, user2Id: string): ChatMessage[] => {
    return mockChatMessages.filter(
      msg => 
        (msg.emisorId === user1Id && msg.receptorId === user2Id) ||
        (msg.emisorId === user2Id && msg.receptorId === user1Id)
    ).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  },

  // Get all conversations for a user
  getUserConversations: (userId: string): { partnerId: string, lastMessage: ChatMessage }[] => {
    // Get all messages where the user is either sender or receiver
    const userMessages = mockChatMessages.filter(
      msg => msg.emisorId === userId || msg.receptorId === userId
    );
    
    // Group by conversation partner
    const conversationPartners = new Map<string, ChatMessage[]>();
    
    userMessages.forEach(msg => {
      const partnerId = msg.emisorId === userId ? msg.receptorId : msg.emisorId;
      
      if (!conversationPartners.has(partnerId)) {
        conversationPartners.set(partnerId, []);
      }
      
      conversationPartners.get(partnerId)?.push(msg);
    });
    
    // Get the last message for each conversation
    const conversations: { partnerId: string, lastMessage: ChatMessage }[] = [];
    
    conversationPartners.forEach((messages, partnerId) => {
      // Sort messages by timestamp, newest first
      const sortedMessages = [...messages].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      conversations.push({
        partnerId,
        lastMessage: sortedMessages[0]
      });
    });
    
    // Sort conversations by last message time, newest first
    return conversations.sort(
      (a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    );
  },
  
  // Get unread message count for a user
  getUnreadMessageCount: (userId: string): number => {
    return mockChatMessages.filter(
      msg => msg.receptorId === userId && !msg.leido
    ).length;
  },
  
  // Send a new message
  sendMessage: (message: Omit<ChatMessage, 'id'>): ChatMessage => {
    const newMessage: ChatMessage = {
      ...message,
      id: (mockChatMessages.length + 1).toString(),
    };
    
    // In a real app, this would send a request to an API
    mockChatMessages.push(newMessage);
    
    return newMessage;
  },
  
  // Mark messages as read
  markMessagesAsRead: (userId: string, partnerId: string): void => {
    // Find all unread messages sent by partner to user
    mockChatMessages.forEach((msg, index) => {
      if (msg.emisorId === partnerId && msg.receptorId === userId && !msg.leido) {
        mockChatMessages[index] = { ...msg, leido: true };
      }
    });
  }
};
