
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import TimelineHeader from "./TimelineHeader";
import AsinRow from "./AsinRow";
import MetricsSelector from "./MetricsSelector";
import { generateDummyAsinData } from "@/lib/dummy-data";
import { ChevronDown, Filter, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

// Available metrics that can be displayed
export const AVAILABLE_METRICS = [
  { id: "revenue", name: "Revenue", color: "#4CAF50" },
  { id: "unitsSold", name: "Units Sold", color: "#2196F3" },
  { id: "sessions", name: "Sessions", color: "#9C27B0" },
  { id: "conversionRate", name: "Conversion Rate", color: "#FF9800" },
  { id: "adSpend", name: "Ad-Spend", color: "#F44336" },
  { id: "acos", name: "ACoS", color: "#795548" },
  { id: "tacos", name: "TACoS", color: "#607D8B" },
  { id: "dos", name: "DOS", color: "#009688" },
  { id: "deals", name: "Deals", color: "#E91E63" },
];

// Generate dummy data for 40 ASINs
const dummyData = generateDummyAsinData(40);

interface AsinTimelineProps {
  onChatAboutCheck?: (asinId: string, checkDate: string, checkId: string) => void;
}

const AsinTimeline = ({ onChatAboutCheck }: AsinTimelineProps) => {
  // State to manage which ASINs are expanded
  const [expandedAsins, setExpandedAsins] = useState<Record<string, boolean>>({});
  
  // State to track selected metrics (revenue is always visible)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["revenue", "conversionRate", "adSpend"]);
  
  // State to track the date range (we'll use 14 days by default for better visibility)
  const [dateRange, setDateRange] = useState({ 
    start: new Date(new Date().setDate(new Date().getDate() - 14)), 
    end: new Date() 
  });
  
  // Toggle ASIN expansion
  const toggleAsinExpand = (asinId: string) => {
    setExpandedAsins(prev => ({
      ...prev,
      [asinId]: !prev[asinId]
    }));
  };

  return (
    <Card className="shadow-sm overflow-hidden p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold">ASIN Performance Timeline</h2>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="h-4 w-4 mr-2" />
            Last 14 Days
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          
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
              <SelectValue placeholder="Parent ASIN" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parent ASINs</SelectItem>
              <SelectItem value="B08MASTER">B08MASTER</SelectItem>
              <SelectItem value="B07XYZ1234">B07XYZ1234</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Metrics selector component */}
      <MetricsSelector 
        availableMetrics={AVAILABLE_METRICS}
        selectedMetrics={selectedMetrics}
        onMetricsChange={setSelectedMetrics}
      />
      
      {/* Horizontal scrollable container */}
      <ScrollArea className="w-full overflow-x-auto" orientation="horizontal">
        <div className="min-w-[800px]">
          {/* Timeline header with dates */}
          <div className="mt-6 mb-2 border-b pb-2">
            <TimelineHeader dateRange={dateRange} />
          </div>
          
          {/* ASIN rows */}
          <div className="space-y-1">
            {dummyData.map((parentAsin) => (
              <div key={parentAsin.id} className="mb-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-bold text-lg p-2 bg-secondary/30 rounded-md mb-1 cursor-pointer flex items-center"
                  onClick={() => {
                    // Toggle all child ASINs when clicking on parent
                    const newExpandedState = !parentAsin.children.every(
                      child => expandedAsins[child.id]
                    );
                    
                    const updates: Record<string, boolean> = {};
                    parentAsin.children.forEach(child => {
                      updates[child.id] = newExpandedState;
                    });
                    
                    setExpandedAsins(prev => ({
                      ...prev,
                      ...updates
                    }));
                  }}
                >
                  {parentAsin.name}
                  <ChevronDown className="h-5 w-5 ml-2" />
                </motion.div>
                
                <AnimatePresence>
                  {parentAsin.children.map((asin) => (
                    <AsinRow
                      key={asin.id}
                      asin={asin}
                      isExpanded={!!expandedAsins[asin.id]}
                      toggleExpand={() => toggleAsinExpand(asin.id)}
                      selectedMetrics={selectedMetrics}
                      dateRange={dateRange}
                      onChatAboutCheck={onChatAboutCheck}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default AsinTimeline;
