
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  MessageSquare, 
  X, 
  ChevronRight,
  ChevronLeft
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
import { ScrollArea } from "@/components/ui/scroll-area";

const AgentSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(true);
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
      } else if (content.includes("@PPC")) {
        responseContent = "PPC Agent here. I've analyzed your advertising campaigns and identified opportunities to optimize your ACOS. Would you like me to suggest bid adjustments for your top keywords?";
      } else if (content.includes("@DSP")) {
        responseContent = "DSP Agent here. Your display ads are performing 15% better than last month. I've identified new audience segments that could further improve your ROAS.";
      } else if (content.includes("@Deals")) {
        responseContent = "Deals Agent here. I've found 3 opportunities for Lightning Deals that match your criteria. The best opportunity is for B001234 with a projected ROI of 220%.";
      } else if (content.includes("@Listings")) {
        responseContent = "Listings Agent here. I've reviewed your product listings and found several optimization opportunities. Your main competitors are outranking you on 7 key search terms.";
      } else if (content.includes("@Creative")) {
        responseContent = "Creative Agent here. I've analyzed your A+ content performance. Products with enhanced content are converting 22% better than those without. Would you like recommendations for your top 5 ASINs?";
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
  
  const toggleDock = () => {
    setIsDocked(!isDocked);
    setIsOpen(true); // Always open when toggling dock state
  };
  
  return (
    <>
      {/* Docked sidebar or floating button */}
      <AnimatePresence>
        {isDocked ? (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: isOpen ? 0 : 'calc(100% - 20px)' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-screen z-40 flex"
          >
            <div 
              className="h-full flex items-center cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="px-1 py-10 rounded-l-md bg-secondary">
                {isOpen ? (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <div 
              className="w-[350px] h-full bg-background border-l shadow-lg flex flex-col overflow-hidden"
            >
              <div className="border-b p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-semibold">Brand Assistant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                    onClick={toggleDock}
                    title="Undock"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setIsOpen(false)}
                    title="Hide"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-3 space-y-4">
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
              </ScrollArea>
              
              <div className="border-t h-[50vh]">
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
                    <button 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                      onClick={() => handleNewChat()}
                    >
                      Start New Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              className="flex items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg"
              onClick={() => setIsOpen(true)}
            >
              <Bot className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating dialog when undocked */}
      {!isDocked && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 right-6 w-[380px] h-[600px] bg-background rounded-lg shadow-xl border overflow-hidden z-50 flex flex-col"
            >
              <div className="border-b p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-semibold">Brand Assistant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                    onClick={toggleDock}
                    title="Dock to side"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setIsOpen(false)}
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-3 space-y-4">
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
              </ScrollArea>
              
              <div className="border-t h-[50%]">
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
                    <button 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                      onClick={() => handleNewChat()}
                    >
                      Start New Chat
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default AgentSidebar;
