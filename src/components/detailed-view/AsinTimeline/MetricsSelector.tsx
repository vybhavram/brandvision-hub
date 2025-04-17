
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Settings2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MetricOption {
  id: string;
  name: string;
  color: string;
}

interface MetricsSelectorProps {
  availableMetrics: MetricOption[];
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
}

const MetricsSelector = ({ 
  availableMetrics, 
  selectedMetrics, 
  onMetricsChange 
}: MetricsSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMetric = (metricId: string) => {
    // Revenue is always selected
    if (metricId === "revenue") return;
    
    if (selectedMetrics.includes(metricId)) {
      onMetricsChange(selectedMetrics.filter(id => id !== metricId));
    } else {
      onMetricsChange([...selectedMetrics, metricId]);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Metrics:</span>
        
        {/* Always show revenue badge */}
        <Badge 
          variant="outline" 
          className="bg-gray-100 border-primary/20 text-primary font-medium"
        >
          Revenue
        </Badge>
        
        {/* Show badges for other selected metrics */}
        {selectedMetrics
          .filter(id => id !== "revenue") // Revenue is already shown
          .map(metricId => {
            const metric = availableMetrics.find(m => m.id === metricId);
            if (!metric) return null;
            
            return (
              <Badge 
                key={metric.id}
                variant="outline"
                className="bg-gray-100 border-gray-200"
                onClick={() => toggleMetric(metric.id)}
              >
                {metric.name}
                <button 
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMetric(metric.id);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </Badge>
            );
          })}
      </div>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1 whitespace-nowrap"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Configure Metrics
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <h3 className="font-medium mb-2">Available Metrics</h3>
          <div className="max-h-[300px] overflow-y-auto">
            {availableMetrics.map((metric) => {
              const isSelected = selectedMetrics.includes(metric.id);
              const isRevenue = metric.id === "revenue"; // Revenue is always selected
              
              return (
                <motion.div
                  key={metric.id}
                  initial={false}
                  animate={{ backgroundColor: isSelected ? 'rgba(0,0,0,0.05)' : 'transparent' }}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                    isRevenue ? 'opacity-60 pointer-events-none' : ''
                  }`}
                  onClick={() => toggleMetric(metric.id)}
                >
                  <div 
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary' : 'border border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                  </div>
                  
                  <span className="flex-1">{metric.name}</span>
                  
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: metric.color }}
                  />
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MetricsSelector;
