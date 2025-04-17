
import React, { useState, useRef, useEffect } from "react";
import { ArrowUpCircle, User, Plus, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

// Define the types for messages
export interface Agent {
  name: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  agent?: Agent;
}

interface AgentChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const AgentChat: React.FC<AgentChatProps> = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");
  const [mentionSearch, setMentionSearch] = useState<string | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Example agents for @ mentions
  const mentionableAgents = [
    { id: 'ppc', name: 'PPC Agent', avatar: '💰' },
    { id: 'dsp', name: 'DSP Agent', avatar: '📊' },
    { id: 'deals', name: 'Deals Agent', avatar: '🏷️' },
    { id: 'listings', name: 'Listings Agent', avatar: '📝' },
    { id: 'creative', name: 'Creative Agent', avatar: '🎨' },
  ];
  
  // Filtered agents based on search term
  const filteredAgents = mentionableAgents.filter(agent => 
    !mentionSearch || agent.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Handle @ mentions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Check for @ symbol to trigger mentions
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1 && atIndex === value.length - 1) {
      // User just typed @, show all options
      setMentionSearch("");
      setShowMentions(true);
    } else if (atIndex !== -1) {
      // User is typing after @, filter based on what they type
      const searchTerm = value.substring(atIndex + 1);
      setMentionSearch(searchTerm);
      setShowMentions(searchTerm.length > 0 || searchTerm === "");
    } else {
      // No @ symbol, hide mentions
      setShowMentions(false);
    }
  };
  
  const insertMention = (agent: typeof mentionableAgents[0]) => {
    const atIndex = inputValue.lastIndexOf('@');
    if (atIndex !== -1) {
      // Replace the @search with @agentName
      const newValue = inputValue.substring(0, atIndex) + `@${agent.name} `;
      setInputValue(newValue);
      setShowMentions(false);
      
      // Focus back on input after selection
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 
                  ${message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                  }`}
              >
                {message.role === 'assistant' && message.agent && (
                  <div className="flex items-center mb-1 gap-1">
                    <span className="font-medium text-sm">{message.agent.avatar} {message.agent.name}</span>
                  </div>
                )}
                <div className="mb-1">{message.content}</div>
                <div className="text-xs opacity-70 text-right">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input area with mention dropdown */}
      <div className="border-t p-4 relative">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type a message... (Use @ to mention an agent)"
              className="pr-10"
            />
            
            {/* Mention dropdown */}
            <AnimatePresence>
              {showMentions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-0 mb-1 bg-background rounded-md shadow-lg border w-full max-h-[200px] overflow-auto z-10"
                >
                  {filteredAgents.length > 0 ? (
                    filteredAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                        onClick={() => insertMention(agent)}
                      >
                        <div className="text-lg">{agent.avatar}</div>
                        <span>{agent.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-muted-foreground">No agents found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AgentChat;
