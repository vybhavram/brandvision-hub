
import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, X, ChevronRight, ChevronLeft, MessageSquare, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import AgentChat from "./AgentChat";
import AgentAlerts from "./AgentAlerts";
import ChatHistory from "./ChatHistory";

const AgentSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "alerts">("chat");
  const isMobile = useMobile();
  
  // Calculate optimal sidebar width based on screen size
  const sidebarWidth = isMobile ? "100%" : "380px";
  
  return (
    <>
      {/* Fixed sidebar toggle button */}
      {!isOpen && (
        <Button 
          variant="secondary"
          size="icon"
          className="fixed right-4 bottom-4 rounded-full shadow-lg z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
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
                <div className="flex-initial p-3 border-b">
                  <ChatHistory />
                </div>
                <div className="flex-1 overflow-hidden">
                  <AgentChat />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="alerts" className="flex-1 p-0 overflow-auto">
              <AgentAlerts />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </>
  );
};

export default AgentSidebar;
