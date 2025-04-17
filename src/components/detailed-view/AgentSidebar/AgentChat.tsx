import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Send, Hash, Bot } from "lucide-react";
import { ChatMessage } from "@/lib/dummy-data";

interface AgentChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

const AgentChat = ({ messages, onSendMessage }: AgentChatProps) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const formatMessageContent = (content: string) => {
    return content.replace(
      /#(B[0-9]{6})/g,
      '<span class="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"><span class="mr-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3v18"/><path d="M14 3v18"/></svg></span>$1</span>'
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex max-w-[85%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex-shrink-0 ${
                  message.role === "user" ? "ml-2" : "mr-2"
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.role === "user" ? (
                    <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-sm">
                      BM
                    </div>
                  ) : (
                    <div className="bg-blue-100 text-blue-800 h-full w-full flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                </Avatar>
              </div>
              <div
                className={`rounded-lg p-3 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} />
                <div
                  className={`text-xs mt-1 ${
                    message.role === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t">
        <div className="flex relative">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or use # to reference an ASIN..."
            className="min-h-[60px] resize-none pr-10"
          />
          <div className="absolute right-3 bottom-3">
            <Button
              size="icon"
              className="h-7 w-7 rounded-full bg-primary"
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          <Hash className="h-3 w-3 mr-1" />
          <span>Type # followed by an ASIN (e.g., #B001234) to reference a product</span>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
