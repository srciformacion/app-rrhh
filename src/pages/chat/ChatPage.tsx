
import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { chatService } from "@/services/chatService";
import { userService } from "@/services/userService";
import { Redirect } from "@/components/UI/Redirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Separator, 
  Avatar, 
  AvatarImage, 
  AvatarFallback,
  Badge
} from "@/components/ui";
import { PaperclipIcon, SendIcon } from "lucide-react";

export default function ChatPage() {
  const { currentUser, isAuthenticated } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [partners, setPartners] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Redirect if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <Redirect to="/login" />;
  }
  
  useEffect(() => {
    // Get all chat partners for this user
    const conversations = chatService.getUserConversations(currentUser.id);
    const fetchedPartners = conversations.map(convo => ({
      user: userService.getUserById(convo.partnerId),
      lastMessage: convo.lastMessage,
    })).filter(p => p.user); // Filter out undefined users
    
    setPartners(fetchedPartners);
    
    // If no active chat but we have partners, set the first one active
    if (!activeChat && fetchedPartners.length > 0) {
      setActiveChat(fetchedPartners[0].user.id);
    }
  }, [currentUser.id]);
  
  useEffect(() => {
    // Get messages for active chat
    if (activeChat) {
      const chatMessages = chatService.getConversation(currentUser.id, activeChat);
      setMessages(chatMessages);
      
      // Mark messages as read
      chatService.markMessagesAsRead(currentUser.id, activeChat);
    }
  }, [activeChat, currentUser.id]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !activeChat) return;
    
    // Send message
    const newMessage = chatService.sendMessage({
      emisorId: currentUser.id,
      receptorId: activeChat,
      mensaje: message,
      timestamp: new Date().toISOString(),
      leido: false,
    });
    
    // Add message to state
    setMessages(prev => [...prev, newMessage]);
    
    // Clear message input
    setMessage("");
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getPartnerName = (partnerId: string) => {
    const partner = partners.find(p => p.user.id === partnerId);
    return partner ? partner.user.nombre : "Usuario";
  };
  
  const getPartnerAvatar = (partnerId: string) => {
    const partner = partners.find(p => p.user.id === partnerId);
    return partner?.user.avatarUrl || null;
  };
  
  const getUnreadCount = (partnerId: string) => {
    return messages.filter(msg => 
      msg.emisorId === partnerId && 
      msg.receptorId === currentUser.id && 
      !msg.leido
    ).length;
  };
  
  return (
    <MainLayout>
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden h-[700px] flex">
        {/* Chat sidebar */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Mensajes</h2>
          </div>
          
          <ScrollArea className="flex-grow">
            <div className="px-2">
              {partners.length > 0 ? (
                partners.map((partner) => (
                  <button
                    key={partner.user.id}
                    className={`w-full p-3 flex items-center text-left hover:bg-gray-100 rounded-md transition-colors ${
                      activeChat === partner.user.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setActiveChat(partner.user.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={partner.user.avatarUrl} />
                      <AvatarFallback>
                        {getInitials(partner.user.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{partner.user.nombre}</h3>
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(partner.lastMessage.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {partner.lastMessage.mensaje}
                      </p>
                    </div>
                    {getUnreadCount(partner.user.id) > 0 && (
                      <Badge className="ml-2 bg-hrm-blue">
                        {getUnreadCount(partner.user.id)}
                      </Badge>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No hay conversaciones activas
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Chat main area */}
        <div className="flex-grow flex flex-col">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={getPartnerAvatar(activeChat)} />
                  <AvatarFallback>
                    {getInitials(getPartnerName(activeChat))}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{getPartnerName(activeChat)}</h2>
                  <p className="text-xs text-gray-500">
                    {userService.getUserById(activeChat)?.rol === 'rrhh' 
                      ? 'Recursos Humanos' 
                      : userService.getUserById(activeChat)?.rol === 'trabajador'
                      ? 'Trabajador'
                      : 'Solicitante'
                    }
                  </p>
                </div>
              </div>
              
              {/* Messages area */}
              <ScrollArea className="flex-grow p-4">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.emisorId === currentUser.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.emisorId === currentUser.id
                              ? "bg-hrm-blue text-white rounded-br-none"
                              : "bg-gray-100 rounded-bl-none"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.mensaje}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.emisorId === currentUser.id
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {formatMessageTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No hay mensajes. Envía el primer mensaje para iniciar la conversación.
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input area */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                  >
                    <PaperclipIcon className="h-5 w-5" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="submit" disabled={!message.trim()}>
                    <SendIcon className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No hay chat seleccionado</h2>
                <p className="text-gray-500">
                  Selecciona una conversación para comenzar a chatear
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
