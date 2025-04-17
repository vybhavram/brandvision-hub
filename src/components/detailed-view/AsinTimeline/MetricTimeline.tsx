
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatValue } from "@/lib/format-utils";
import { InfoIcon } from "lucide-react";

interface MetricTimelineProps {
  data: {
    value: number;
    date: string;
    annotations?: { text: string; type: "info" | "warning" | "success" }[];
  }[];
  color: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  height?: number;
  showAnnotations?: boolean;
  onPointClick?: (day: number, value: number, event: React.MouseEvent) => void;
  onRangeSelect?: (start: number, end: number) => void;
  isSelectable?: boolean;
  selectedRange?: { start: number; end: number };
}

const MetricTimeline = ({
  data,
  color,
  dateRange,
  height = 20,
  showAnnotations = false,
  onPointClick,
  onRangeSelect,
  isSelectable = false,
  selectedRange
}: MetricTimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragCurrent, setDragCurrent] = useState<number | null>(null);
  
  // Find min and max values for scaling
  const minValue = Math.min(...data.map(d => d.value));
  const maxValue = Math.max(...data.map(d => d.value));
  
  // Helper function to normalize a value to the timeline height
  const normalizeValue = (value: number) => {
    if (maxValue === minValue) return height / 2;
    return height - ((value - minValue) / (maxValue - minValue)) * height;
  };
  
  // Mouse event handlers for selection
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!isSelectable || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const dayIndex = Math.floor((relativeX / rect.width) * data.length);
    
    setIsDragging(true);
    setDragStart(dayIndex);
    setDragCurrent(dayIndex);
  };
  
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !isSelectable || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const dayIndex = Math.floor((relativeX / rect.width) * data.length);
    
    setDragCurrent(dayIndex);
  };
  
  const handleMouseUp = () => {
    if (!isDragging || !isSelectable) return;
    
    if (dragStart !== null && dragCurrent !== null && onRangeSelect) {
      const start = Math.min(dragStart, dragCurrent);
      const end = Math.max(dragStart, dragCurrent);
      onRangeSelect(start, end);
    }
    
    setIsDragging(false);
  };
  
  // Clean up mouse events when component unmounts
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  return (
    <div 
      ref={timelineRef}
      className="w-full h-full relative cursor-pointer"
      style={{ height: `${height}px` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-gray-50 rounded"></div>
      
      {/* Selection overlay */}
      {isSelectable && dragStart !== null && dragCurrent !== null && (
        <div
          className="absolute top-0 bottom-0 bg-blue-100 opacity-40"
          style={{
            left: `${(Math.min(dragStart, dragCurrent) / data.length) * 100}%`,
            width: `${((Math.abs(dragCurrent - dragStart) + 1) / data.length) * 100}%`
          }}
        />
      )}
      
      {/* Saved selection range */}
      {selectedRange && (
        <div
          className="absolute top-0 bottom-0 bg-blue-100"
          style={{
            left: `${(selectedRange.start / data.length) * 100}%`,
            width: `${((selectedRange.end - selectedRange.start + 1) / data.length) * 100}%`
          }}
        />
      )}
      
      {/* Line chart */}
      <svg
        className="absolute inset-0"
        viewBox={`0 0 ${data.length} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area under the line */}
        <path
          d={`
            M 0 ${normalizeValue(data[0]?.value || 0)}
            ${data.map((d, i) => `L ${i} ${normalizeValue(d.value)}`).join(' ')}
            L ${data.length - 1} ${height}
            L 0 ${height}
            Z
          `}
          fill={`url(#gradient-${color.replace('#', '')})`}
        />
        
        {/* Line itself */}
        <path
          d={`
            M 0 ${normalizeValue(data[0]?.value || 0)}
            ${data.map((d, i) => `L ${i} ${normalizeValue(d.value)}`).join(' ')}
          `}
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={i}
            cy={normalizeValue(d.value)}
            r="2"
            fill={color}
            onClick={(e) => onPointClick?.(i, d.value, e)}
            className="hover:r-3 transition-all duration-150"
          />
        ))}
      </svg>
      
      {/* Show annotations if enabled */}
      {showAnnotations && (
        <>
          {data.map((d, i) => (
            d.annotations?.map((annotation, annotIndex) => (
              <TooltipProvider key={`${i}-${annotIndex}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className="absolute -top-3 cursor-pointer"
                      style={{ left: `${(i / data.length) * 100}%` }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <div 
                        className={`rounded-full p-1 ${
                          annotation.type === 'warning' 
                            ? 'bg-amber-500' 
                            : annotation.type === 'success' 
                              ? 'bg-green-500' 
                              : 'bg-blue-500'
                        }`}
                      >
                        <InfoIcon size={10} className="text-white" />
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">{annotation.text}</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          ))}
        </>
      )}
    </div>
  );
};

export default MetricTimeline;
