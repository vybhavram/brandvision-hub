import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  MessageSquare, 
  X 
} from "lucide-react";
import { 
  AgentAlert, 
  Chat, 
  ChatMessage, 
  generateMockAgentAlerts, 
  generateMockChatHistory 
} from "@/lib/dummy-data";
import AgentAlerts from "./AgentAlerts";
import AgentChat from "./AgentChat";
import ChatHistory from "./ChatHistory";

const AgentSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<AgentAlert[]>([]);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [currentChatMessages, setCurrentChatMessages] = useState<ChatMessage[]>([]);
  
  useEffect(() => {
    const mockAlerts = generateMockAgentAlerts();
    const mockChats = generateMockChatHistory();
    
    setAlerts(mockAlerts);
    setChatHistory(mockChats);
    
    if (mockChats.length > 0) {
      setActiveChat(mockChats[0].id);
      setCurrentChatMessages(mockChats[0].messages);
    }
  }, []);
  
  useEffect(() => {
    if (activeChat) {
      const chat = chatHistory.find(c => c.id === activeChat);
      if (chat) {
        setCurrentChatMessages(chat.messages);
      }
    } else {
      setCurrentChatMessages([]);
    }
  }, [activeChat, chatHistory]);
  
  const handleDismissAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'dismissed' as const } 
          : alert
      )
    );
  };
  
  const handleActionAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'actioned' as const } 
          : alert
      )
    );
    
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      const newChatId = `chat-alert-${alertId}`;
      const existingChat = chatHistory.find(c => c.id === newChatId);
      
      if (!existingChat) {
        const now = new Date().toISOString();
        const newChat: Chat = {
          id: newChatId,
          title: `Alert: ${alert.title}`,
          lastMessageTime: now,
          messages: [
            {
              id: `msg-${newChatId}-1`,
              role: 'agent',
              content: `I've noticed an issue that requires your attention: ${alert.description} What would you like me to do about this?`,
              timestamp: now
            }
          ]
        };
        
        setChatHistory(prev => [newChat, ...prev]);
        setActiveChat(newChatId);
      } else {
        setActiveChat(existingChat.id);
      }
    }
  };
  
  const handleSendMessage = (content: string) => {
    if (!activeChat) {
      handleNewChat(content);
      return;
    }
    
    const now = new Date().toISOString();
    const newMessage: ChatMessage = {
      id: `msg-${activeChat}-${currentChatMessages.length + 1}`,
      role: 'user',
      content,
      timestamp: now
    };
    
    const asinMatches = content.match(/#(B[0-9]{6})/g);
    if (asinMatches) {
      newMessage.asinReferences = asinMatches.map(match => match.substring(1));
    }
    
    const updatedMessages = [...currentChatMessages, newMessage];
    setCurrentChatMessages(updatedMessages);
    
    setChatHistory(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChat 
          ? {
              ...chat,
              lastMessageTime: now,
              messages: updatedMessages
            }
          : chat
      )
    );
    
    setTimeout(() => {
      const responseNow = new Date().toISOString();
      let responseContent = "I'm analyzing your request...";
      
      if (content.toLowerCase().includes("inventory")) {
        responseContent = "Based on current inventory levels, I recommend placing an order soon to avoid stockouts. The current sell-through rate indicates you have approximately 12 days of stock remaining.";
      } else if (content.toLowerCase().includes("competitor") || content.toLowerCase().includes("price")) {
        responseContent = "I've analyzed competitor pricing trends. Your main competitor has reduced prices by 8% in the last week. Would you like me to recommend pricing adjustments?";
      } else if (asinMatches && asinMatches.length > 0) {
        const asin = asinMatches[0].substring(1);
        responseContent = `I've analyzed the performance of ${asin}. This product has shown a 12% increase in conversion rate over the last 7 days, but there's a concerning trend in inventory levels. Would you like a detailed report?`;
      }
      
      const agentResponse: ChatMessage = {
        id: `msg-${activeChat}-${updatedMessages.length + 1}`,
        role: 'agent',
        content: responseContent,
        timestamp: responseNow
      };
      
      const messagesWithResponse = [...updatedMessages, agentResponse];
      setCurrentChatMessages(messagesWithResponse);
      
      setChatHistory(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChat 
            ? {
                ...chat,
                lastMessageTime: responseNow,
                messages: messagesWithResponse
              }
            : chat
        )
      );
    }, 1500);
  };
  
  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
  };
  
  const handleNewChat = (initialMessage?: string) => {
    const now = new Date().toISOString();
    const newChatId = `chat-${Date.now()}`;
    
    const initialMessages: ChatMessage[] = initialMessage 
      ? [
          {
            id: `msg-${newChatId}-1`,
            role: 'user',
            content: initialMessage,
            timestamp: now
          }
        ]
      : [];
    
    const newChat: Chat = {
      id: newChatId,
      title: initialMessage 
        ? initialMessage.substring(0, 20) + (initialMessage.length > 20 ? '...' : '') 
        : 'New Conversation',
      lastMessageTime: now,
      messages: initialMessages
    };
    
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChat(newChatId);
    setCurrentChatMessages(initialMessages);
    
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  };
  
  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full z-50 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-6 w-6" />
      </Button>
      
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="h-[90vh] mx-auto w-full max-w-md rounded-t-[10px]">
          <DrawerHeader className="border-b pb-2">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-primary" />
                Brand Assistant
              </DrawerTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>
          
          <div className="p-4 flex flex-col h-[calc(90vh-60px)]">
            <AgentAlerts
              alerts={alerts}
              onDismiss={handleDismissAlert}
              onAction={handleActionAlert}
            />
            
            <ChatHistory
              chats={chatHistory}
              activeChat={activeChat}
              onSelectChat={handleSelectChat}
              onNewChat={() => handleNewChat()}
            />
            
            <div className="flex-1 bg-background rounded-md border overflow-hidden flex flex-col">
              {activeChat ? (
                <AgentChat
                  messages={currentChatMessages}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Active Conversation
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start a new chat with the brand assistant to get insights and recommendations.
                  </p>
                  <Button onClick={() => handleNewChat()}>
                    Start New Chat
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AgentSidebar;
