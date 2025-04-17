
import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, X, ChevronRight, ChevronLeft, MessageSquare, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import AgentChat from "./AgentChat";
import AgentAlerts from "./AgentAlerts";
import ChatHistory from "./ChatHistory";

interface AgentSidebarProps {
  initialOpen?: boolean;
}

const AgentSidebar = ({ initialOpen = false }: AgentSidebarProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [activeTab, setActiveTab] = useState<"chat" | "alerts">("chat");
  const isMobile = useIsMobile();
  
  // Calculate optimal sidebar width based on screen size
  const sidebarWidth = isMobile ? "100%" : "380px";
  
  return (
    <>
      {/* Fixed sidebar toggle button */}
      {!isOpen && (
        <div className="fixed right-0 top-1/3 transform -translate-y-1/2 z-50">
          <Button 
            variant="secondary"
            size="sm"
            className="h-24 rounded-l-lg rounded-r-none shadow-lg flex flex-col items-center justify-center gap-2 px-2"
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs rotate-180" style={{ writingMode: 'vertical-rl' }}>Agent Chat</span>
          </Button>
        </div>
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 right-0 bottom-0 z-50 shadow-xl bg-background"
        style={{ width: sidebarWidth, maxWidth: "100%" }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header with tabs */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold">Brand Agent</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Tabs navigation */}
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <div className="border-b">
              <TabsList className="w-full flex">
                <TabsTrigger 
                  value="chat" 
                  className="flex-1"
                  onClick={() => setActiveTab("chat")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span>Chat</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="alerts" 
                  className="flex-1"
                  onClick={() => setActiveTab("alerts")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  <span>Alerts</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Tab content - making chat window taller */}
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex-none p-3 border-b max-h-[120px] overflow-auto">
                  <ChatHistory 
                    chats={[
                      { id: '1', title: 'ASIN Check Issues', date: new Date().toISOString() },
                      { id: '2', title: 'Inventory Planning', date: new Date(Date.now() - 86400000).toISOString() },
                    ]}
                    activeChat="1"
                    onSelectChat={(id) => console.log('Selected chat:', id)}
                    onNewChat={() => console.log('New chat requested')}
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <AgentChat 
                    messages={[
                      { id: '1', content: 'Hello! How can I assist you today?', sender: 'agent', timestamp: new Date().toISOString(), agent: { name: 'Brand Assistant', avatar: '😊' } },
                    ]}
                    onSendMessage={(message) => console.log('Message sent:', message)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="alerts" className="flex-1 p-0 overflow-auto">
              <AgentAlerts 
                alerts={[
                  { id: '1', title: 'Inventory Warning', description: 'Low stock for ASIN B000101', type: 'warning', date: new Date().toISOString() },
                  { id: '2', title: 'Price Change', description: 'Competitor price drop for ASIN B000102', type: 'info', date: new Date(Date.now() - 86400000).toISOString() },
                ]}
                onDismiss={(id) => console.log('Dismissed alert:', id)}
                onAction={(id, action) => console.log('Alert action:', id, action)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </>
  );
};

export default AgentSidebar;
