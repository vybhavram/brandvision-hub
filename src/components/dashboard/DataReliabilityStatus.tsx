
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

// Sample data sources status
const dataSources = [
  {
    name: "Snowflake",
    status: "success",
    lastUpdated: "Today, 08:32 AM",
    message: "All systems operational"
  },
  {
    name: "Amazon SP-API",
    status: "warning",
    lastUpdated: "Today, 07:15 AM",
    message: "API experiencing intermittent delays"
  },
  {
    name: "Advertising API",
    status: "success",
    lastUpdated: "Today, 08:30 AM",
    message: "All systems operational"
  },
  {
    name: "Inventory API",
    status: "error",
    lastUpdated: "Yesterday, 11:45 PM",
    message: "Connection error, data may be stale"
  }
];

const DataReliabilityStatus = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Data Reliability Status</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">
                  Shows the current status of data sources used to populate the dashboard. 
                  Green indicates normal operation, yellow indicates issues that may affect 
                  data freshness, and red indicates critical issues.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dataSources.map((source, index) => (
            <motion.div
              key={source.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-center p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center">
                <div 
                  className={`h-3 w-3 rounded-full mr-3 ${
                    source.status === "success" 
                      ? "bg-green-500" 
                      : source.status === "warning" 
                        ? "bg-amber-500" 
                        : "bg-red-500"
                  }`}
                />
                <span className="text-sm font-medium">{source.name}</span>
              </div>
              <div className="ml-auto flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground mr-2">
                        {source.lastUpdated}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-xs">{source.message}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataReliabilityStatus;
