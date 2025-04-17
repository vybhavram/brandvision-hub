
import { useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, ChevronDown, Download, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import AsinTimeline from "@/components/detailed-view/AsinTimeline";
import AgentSidebar from "@/components/detailed-view/AgentSidebar";
import { toast } from "sonner";

const DetailedView = () => {
  const [dateRange, setDateRange] = useState("30"); // Default to 30 days

  const handleChatAboutAsinCheck = (asinId: string, checkDate: string, checkId: string) => {
    // This would open the agent sidebar and start a new chat about this check
    toast.success("Opening chat about check", {
      description: `Starting conversation about ${asinId} check from ${new Date(checkDate).toLocaleDateString()}`
    });
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {/* Top Bar with controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Brand Detailed View</h1>
              <p className="text-sm text-muted-foreground">
                In-depth analysis of ASINs and their performance metrics
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select 
              defaultValue={dateRange} 
              onValueChange={(value) => setDateRange(value)}
            >
              <SelectTrigger className="w-[160px] h-9">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Date Range" />
                <ChevronDown className="h-4 w-4 ml-2" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="14">Last 14 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="60">Last 60 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Select ASIN" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ASINs</SelectItem>
                <SelectItem value="B08MASTER">B08MASTER</SelectItem>
                <SelectItem value="B07XYZ1234">B07XYZ1234</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Parent ASIN: B08MASTER
          </Badge>
          <Badge variant="outline" className="bg-secondary/50">
            40 ASINs
          </Badge>
          <Badge variant="outline" className="bg-secondary/50">
            Data Updated: 30 min ago
          </Badge>
        </div>
        
        {/* Timeline View with scrollable content */}
        <div className="pr-5 md:pr-0">
          <AsinTimeline onChatAboutCheck={handleChatAboutAsinCheck} />
        </div>
        
        {/* Agent Sidebar - now dockable to the side */}
        <AgentSidebar />
      </motion.div>
    </MainLayout>
  );
};

export default DetailedView;
