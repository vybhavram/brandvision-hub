
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Send, Hash, Bot, AtSign, X, Package, Activity, Tag, Paintbrush } from "lucide-react";
import { ChatMessage } from "@/lib/dummy-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Defining the available agents
export const AGENTS = [
  { id: "ppc", name: "PPC Agent", icon: <Activity className="h-4 w-4" />, color: "#4CAF50" },
  { id: "dsp", name: "DSP Agent", icon: <Activity className="h-4 w-4" />, color: "#2196F3" },
  { id: "deals", name: "Deals Agent", icon: <Tag className="h-4 w-4" />, color: "#FF9800" },
  { id: "listings", name: "Listings Agent", icon: <Package className="h-4 w-4" />, color: "#9C27B0" },
  { id: "creative", name: "Creative Agent", icon: <Paintbrush className="h-4 w-4" />, color: "#E91E63" },
];

interface AgentChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

const AgentChat = ({ messages, onSendMessage }: AgentChatProps) => {
  const [inputValue, setInputValue] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionSearchValue, setMentionSearchValue] = useState("");
  const [caretPosition, setCaretPosition] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
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
    } else if (e.key === "@") {
      // Set the caret position when @ is typed
      if (textAreaRef.current) {
        setCaretPosition(textAreaRef.current.selectionStart + 1);
      }
      setMentionOpen(true);
      setMentionSearchValue("");
    } else if (mentionOpen) {
      if (e.key === "Escape") {
        setMentionOpen(false);
      }
    }
  };
  
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Check if we need to show the mention popover
    if (textAreaRef.current) {
      const currentPos = textAreaRef.current.selectionStart;
      const textBeforeCaret = newValue.substring(0, currentPos);
      const lastAtSymbol = textBeforeCaret.lastIndexOf("@");
      
      if (lastAtSymbol !== -1) {
        const hasSpaceAfterAt = /\s/.test(
          textBeforeCaret.substring(lastAtSymbol + 1, lastAtSymbol + 2)
        );
        
        if (!hasSpaceAfterAt) {
          setCaretPosition(currentPos);
          const searchText = textBeforeCaret.substring(lastAtSymbol + 1);
          setMentionSearchValue(searchText);
          setMentionOpen(true);
          return;
        }
      }
      
      setMentionOpen(false);
    }
  };
  
  const handleSelectAgent = (agent: { id: string; name: string }) => {
    if (!textAreaRef.current) return;
    
    const currentPos = textAreaRef.current.selectionStart;
    const textBeforeMention = inputValue.substring(0, currentPos).lastIndexOf("@");
    
    if (textBeforeMention === -1) return;
    
    const newValue = 
      inputValue.substring(0, textBeforeMention) + 
      `@${agent.name} ` + 
      inputValue.substring(currentPos);
    
    setInputValue(newValue);
    setMentionOpen(false);
    
    // Focus the textarea and set cursor position after the inserted mention
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        const newCursorPos = textBeforeMention + agent.name.length + 2; // +2 for @ and space
        textAreaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };
  
  const formatMessageContent = (content: string) => {
    // Format ASIN references
    let formattedContent = content.replace(
      /#(B[0-9]{6})/g,
      '<span class="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"><span class="mr-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3v18"/><path d="M14 3v18"/></svg></span>$1</span>'
    );
    
    // Format agent mentions
    AGENTS.forEach(agent => {
      const regex = new RegExp(`@(${agent.name})`, 'g');
      formattedContent = formattedContent.replace(
        regex,
        `<span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style="background-color:${agent.color}30;color:${agent.color}"><span class="mr-1">${agent.icon.props.children}</span>$1</span>`
      );
    });
    
    return formattedContent;
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
          <Popover open={mentionOpen} onOpenChange={setMentionOpen}>
            <PopoverTrigger asChild>
              <div className="w-0 h-0 overflow-hidden" />
            </PopoverTrigger>
            <PopoverContent 
              className="w-64 p-0" 
              align="start"
              style={{ 
                position: 'absolute',
                top: caretPosition > 100 ? "-120px" : "60px",
              }}
            >
              <div className="py-2">
                <div className="px-3 py-1 text-xs font-medium text-muted-foreground">
                  Select Agent
                </div>
                <div className="mt-1">
                  {AGENTS.filter(agent => 
                    agent.name.toLowerCase().includes(mentionSearchValue.toLowerCase())
                  ).map(agent => (
                    <button
                      key={agent.id}
                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-secondary flex items-center"
                      onClick={() => handleSelectAgent(agent)}
                    >
                      <Avatar className="h-6 w-6 mr-2">
                        <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: `${agent.color}30`, color: agent.color }}>
                          {agent.icon}
                        </div>
                      </Avatar>
                      {agent.name}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        
          <Textarea
            ref={textAreaRef}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message, use # to reference an ASIN, or @ to tag an agent..."
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
        <div className="mt-2 flex items-center text-xs text-muted-foreground space-x-3">
          <div className="flex items-center">
            <Hash className="h-3 w-3 mr-1" />
            <span>Use # for ASINs</span>
          </div>
          <div className="flex items-center">
            <AtSign className="h-3 w-3 mr-1" />
            <span>Use @ for agents</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
