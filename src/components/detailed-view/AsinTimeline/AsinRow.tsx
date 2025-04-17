
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Pencil, Flag } from "lucide-react";
import MetricTimeline from "./MetricTimeline";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Asin } from "@/lib/dummy-data";

interface AsinRowProps {
  asin: Asin;
  isExpanded: boolean;
  toggleExpand: () => void;
  selectedMetrics: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

const AsinRow = ({ asin, isExpanded, toggleExpand, selectedMetrics, dateRange }: AsinRowProps) => {
  // State for handling timeline selection
  const [selectionActive, setSelectionActive] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [annotationMode, setAnnotationMode] = useState<"none" | "point" | "range">("none");
  
  // State for handling annotation input
  const [annotationText, setAnnotationText] = useState("");
  const [annotationPosition, setAnnotationPosition] = useState({ x: 0, y: 0 });
  
  // Reference to the annotation input for click outside detection
  const annotationInputRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside of annotation input
  useClickOutside(annotationInputRef, () => {
    if (annotationMode !== "none") {
      setAnnotationMode("none");
      setAnnotationText("");
    }
  });
  
  // Handle annotation creation
  const handleCreateAnnotation = () => {
    if (annotationText.trim()) {
      // In a real application, save this annotation to the database
      console.log("Creating annotation:", {
        asinId: asin.id,
        text: annotationText,
        mode: annotationMode,
        position: annotationMode === "point" ? annotationPosition : { start: selectionStart, end: selectionEnd }
      });
      
      // Reset state
      setAnnotationMode("none");
      setAnnotationText("");
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden border-b border-gray-100 last:border-b-0"
    >
      {/* ASIN header row with expand/collapse functionality */}
      <div 
        className="py-2 px-3 grid grid-cols-[180px_1fr] items-center cursor-pointer hover:bg-gray-50 rounded-sm"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
          )}
          <span className="font-medium text-sm">{asin.name}</span>
        </div>
        
        {/* Always show revenue metric in collapsed state */}
        <div className="relative h-8">
          <MetricTimeline 
            data={asin.metrics.revenue}
            color="#4CAF50"
            dateRange={dateRange}
            onPointClick={(day, value, event) => {
              if (annotationMode === "point") {
                const rect = event.currentTarget.getBoundingClientRect();
                setAnnotationPosition({
                  x: event.clientX - rect.left,
                  y: event.clientY - rect.top
                });
              }
            }}
            onRangeSelect={(start, end) => {
              if (annotationMode === "range") {
                setSelectionStart(start);
                setSelectionEnd(end);
              }
            }}
            isSelectable={annotationMode === "range"}
            selectedRange={
              annotationMode === "range" && selectionStart !== null && selectionEnd !== null
                ? { start: selectionStart, end: selectionEnd }
                : undefined
            }
            height={8}
          />
        </div>
      </div>
      
      {/* Expanded metrics */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-10 space-y-1 pb-2"
          >
            {/* Always include revenue at the top */}
            <div className="py-1 grid grid-cols-[180px_1fr] items-center">
              <div className="text-sm text-muted-foreground">Revenue</div>
              <div className="relative h-12">
                <MetricTimeline 
                  data={asin.metrics.revenue}
                  color="#4CAF50"
                  dateRange={dateRange}
                  showAnnotations={true}
                  onPointClick={(day, value, event) => {
                    if (annotationMode === "point") {
                      const rect = event.currentTarget.getBoundingClientRect();
                      setAnnotationPosition({
                        x: event.clientX - rect.left,
                        y: event.clientY - rect.top
                      });
                      
                      // Position the annotation input near the click
                      const annotationInput = annotationInputRef.current;
                      if (annotationInput) {
                        annotationInput.style.left = `${event.clientX}px`;
                        annotationInput.style.top = `${event.clientY + 20}px`;
                      }
                    }
                  }}
                  onRangeSelect={(start, end) => {
                    if (annotationMode === "range") {
                      setSelectionStart(start);
                      setSelectionEnd(end);
                    }
                  }}
                  isSelectable={annotationMode === "range"}
                  selectedRange={
                    annotationMode === "range" && selectionStart !== null && selectionEnd !== null
                      ? { start: selectionStart, end: selectionEnd }
                      : undefined
                  }
                  height={12}
                />
              </div>
            </div>
            
            {/* Show other selected metrics */}
            {selectedMetrics
              .filter(metricId => metricId !== "revenue") // Revenue is already shown
              .map(metricId => {
                const metricData = asin.metrics[metricId as keyof typeof asin.metrics];
                if (!metricData) return null;
                
                // Find the corresponding metric definition
                const metricDef = AVAILABLE_METRICS.find(m => m.id === metricId);
                if (!metricDef) return null;
                
                return (
                  <div 
                    key={metricId} 
                    className="py-1 grid grid-cols-[180px_1fr] items-center"
                  >
                    <div className="text-sm text-muted-foreground">{metricDef.name}</div>
                    <div className="relative h-12">
                      <MetricTimeline 
                        data={metricData}
                        color={metricDef.color}
                        dateRange={dateRange}
                        showAnnotations={true}
                        onPointClick={(day, value, event) => {
                          if (annotationMode === "point") {
                            const rect = event.currentTarget.getBoundingClientRect();
                            setAnnotationPosition({
                              x: event.clientX - rect.left,
                              y: event.clientY - rect.top
                            });
                            
                            // Position the annotation input near the click
                            const annotationInput = annotationInputRef.current;
                            if (annotationInput) {
                              annotationInput.style.left = `${event.clientX}px`;
                              annotationInput.style.top = `${event.clientY + 20}px`;
                            }
                          }
                        }}
                        onRangeSelect={(start, end) => {
                          if (annotationMode === "range") {
                            setSelectionStart(start);
                            setSelectionEnd(end);
                          }
                        }}
                        isSelectable={annotationMode === "range"}
                        selectedRange={
                          annotationMode === "range" && selectionStart !== null && selectionEnd !== null
                            ? { start: selectionStart, end: selectionEnd }
                            : undefined
                        }
                        height={12}
                      />
                    </div>
                  </div>
                );
              })}
              
            {/* Annotation controls */}
            <div className="pt-2 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={`p-1.5 rounded-full ${
                        annotationMode === "point" 
                          ? "bg-primary text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => setAnnotationMode(prev => prev === "point" ? "none" : "point")}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add point annotation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={`p-1.5 rounded-full ${
                        annotationMode === "range" 
                          ? "bg-primary text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        setAnnotationMode(prev => prev === "range" ? "none" : "range");
                        setSelectionStart(null);
                        setSelectionEnd(null);
                      }}
                    >
                      <Flag className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add range annotation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Annotation input dialog */}
      {annotationMode !== "none" && (
        <div 
          ref={annotationInputRef}
          className="fixed z-50 bg-white p-3 rounded-md shadow-lg border border-gray-200"
          style={{
            left: `${annotationPosition.x}px`,
            top: `${annotationPosition.y + 20}px`,
          }}
        >
          <div className="text-sm font-medium mb-2">
            {annotationMode === "point" ? "Add Point Annotation" : "Add Range Annotation"}
          </div>
          <textarea
            className="w-64 h-20 p-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter annotation..."
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="px-3 py-1 text-sm bg-secondary rounded-md"
              onClick={() => {
                setAnnotationMode("none");
                setAnnotationText("");
              }}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-sm bg-primary text-white rounded-md"
              onClick={handleCreateAnnotation}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Import AVAILABLE_METRICS from the parent component
import { AVAILABLE_METRICS } from "./index";

export default AsinRow;
