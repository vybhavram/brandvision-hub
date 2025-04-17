
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { History, Plus, ChevronRight } from "lucide-react";

export interface Chat {
  id: string;
  title: string;
  lastMessageTime: string;
}

interface ChatHistoryProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

const ChatHistory = ({ chats, activeChat, onSelectChat, onNewChat }: ChatHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Sort chats by last message time (newest first)
  const sortedChats = [...chats].sort((a, b) => 
    new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  );
  
  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    
    return date.toLocaleDateString();
  };
  
  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between p-2 bg-secondary/30 rounded-md cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium">Chat History</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}>
          {isExpanded ? "Hide" : "Show"}
        </Button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start mb-3"
                onClick={onNewChat}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              
              <div className="space-y-1">
                {sortedChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm
                      ${chat.id === activeChat 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-secondary"
                      }`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex items-center truncate">
                      <ChevronRight className={`h-4 w-4 mr-1 transition-transform
                        ${chat.id === activeChat ? "rotate-90" : ""}`} 
                      />
                      <span className="truncate">{chat.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatRelativeTime(chat.lastMessageTime)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatHistory;
