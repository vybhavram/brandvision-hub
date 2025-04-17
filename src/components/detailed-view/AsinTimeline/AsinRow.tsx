
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronDown, 
  Pencil, 
  Flag, 
  Bot, 
  Check, 
  X, 
  Info, 
  MessageSquare 
} from "lucide-react";
import MetricTimeline from "./MetricTimeline";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Asin, DailyAgentChecks } from "@/lib/dummy-data";
import { formatValue } from "@/lib/format-utils";

interface AsinRowProps {
  asin: Asin;
  isExpanded: boolean;
  toggleExpand: () => void;
  selectedMetrics: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  onChatAboutCheck?: (asinId: string, checkDate: string, checkId: string) => void;
}

const AsinRow = ({ 
  asin, 
  isExpanded, 
  toggleExpand, 
  selectedMetrics, 
  dateRange,
  onChatAboutCheck
}: AsinRowProps) => {
  const [selectionActive, setSelectionActive] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [annotationMode, setAnnotationMode] = useState<"none" | "point" | "range">("none");
  
  const [annotationText, setAnnotationText] = useState("");
  const [annotationPosition, setAnnotationPosition] = useState({ x: 0, y: 0 });
  
  const [activeCheck, setActiveCheck] = useState<{
    date: string;
    checkId: string;
  } | null>(null);
  
  const annotationInputRef = useRef<HTMLDivElement>(null);
  const checkDetailsRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(annotationInputRef, () => {
    if (annotationMode !== "none") {
      setAnnotationMode("none");
      setAnnotationText("");
    }
  });
  
  useClickOutside(checkDetailsRef, () => {
    setActiveCheck(null);
  });
  
  const handleCreateAnnotation = () => {
    if (annotationText.trim()) {
      console.log("Creating annotation:", {
        asinId: asin.id,
        text: annotationText,
        mode: annotationMode,
        position: annotationMode === "point" ? annotationPosition : { start: selectionStart, end: selectionEnd }
      });
      
      setAnnotationMode("none");
      setAnnotationText("");
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };
  
  const filteredAgentChecks = asin.agentChecks.filter(check => {
    const checkDate = new Date(check.date);
    return checkDate >= dateRange.start && checkDate <= dateRange.end;
  });
  
  const renderCheckDetails = () => {
    if (!activeCheck) return null;
    
    const checkDate = new Date(activeCheck.date);
    const dailyCheck = asin.agentChecks.find(c => new Date(c.date).toDateString() === checkDate.toDateString());
    if (!dailyCheck) return null;
    
    const checkDetail = dailyCheck.checks.find(c => c.id === activeCheck.checkId);
    if (!checkDetail) return null;
    
    const positionStyle = {
      top: `${window.innerHeight / 2 - 100}px`,
      left: `${window.innerWidth / 2 - 150}px`
    };
    
    return (
      <div 
        ref={checkDetailsRef}
        className="fixed z-50 bg-white p-4 rounded-md shadow-lg border border-gray-200 w-[300px]"
        style={positionStyle}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm">{checkDetail.name}</h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setActiveCheck(null)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mb-3">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
            checkDetail.result === 'pass' 
              ? 'bg-green-100 text-green-800' 
              : checkDetail.result === 'warning'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {checkDetail.result === 'pass' ? (
              <Check className="h-3 w-3 mr-1" />
            ) : checkDetail.result === 'warning' ? (
              <Info className="h-3 w-3 mr-1" />
            ) : (
              <X className="h-3 w-3 mr-1" />
            )}
            {checkDetail.result.charAt(0).toUpperCase() + checkDetail.result.slice(1)}
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mb-2">{checkDetail.description}</p>
        
        {checkDetail.details && (
          <div className="text-xs p-2 bg-gray-50 rounded mb-3">
            {checkDetail.details}
          </div>
        )}
        
        <div className="flex justify-end">
          <button 
            className="flex items-center text-xs text-blue-600 hover:text-blue-800"
            onClick={() => {
              if (onChatAboutCheck) {
                onChatAboutCheck(asin.id, activeCheck.date, activeCheck.checkId);
                setActiveCheck(null);
              }
            }}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Chat about this issue
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden border-b border-gray-100 last:border-b-0"
    >
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
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-10 space-y-1 pb-2"
          >
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
            
            {selectedMetrics
              .filter(metricId => metricId !== "revenue")
              .map(metricId => {
                const metricData = asin.metrics[metricId as keyof typeof asin.metrics];
                if (!metricData) return null;
                
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
            
            <div className="py-1 grid grid-cols-[180px_1fr] items-center">
              <div className="text-sm text-muted-foreground flex items-center">
                <Bot className="h-4 w-4 mr-1" />
                <span>Agent Checks</span>
              </div>
              <div className="relative h-12 bg-transparent rounded border border-gray-100">
                {filteredAgentChecks.map((dailyCheck, index) => {
                  const segmentWidth = 100 / filteredAgentChecks.length;
                  const checkDate = new Date(dailyCheck.date);
                  
                  return (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`h-8 flex items-center justify-center cursor-pointer border-r last:border-r-0 border-gray-100
                              ${dailyCheck.overallStatus === 'pass' 
                                ? 'text-green-600 hover:bg-green-50' 
                                : dailyCheck.overallStatus === 'warning'
                                  ? 'text-yellow-600 hover:bg-yellow-50'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                            style={{ width: `${segmentWidth}%` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              
                              const failedCheck = dailyCheck.checks.find(c => c.result === 'fail');
                              const warningCheck = dailyCheck.checks.find(c => c.result === 'warning');
                              const checkToShow = failedCheck || warningCheck || dailyCheck.checks[0];
                              
                              if (checkToShow) {
                                setActiveCheck({
                                  date: dailyCheck.date,
                                  checkId: checkToShow.id
                                });
                              }
                            }}
                          >
                            {dailyCheck.overallStatus === 'pass' ? (
                              <Check className="h-4 w-4" />
                            ) : dailyCheck.overallStatus === 'warning' ? (
                              <Info className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-medium mb-1">{checkDate.toLocaleDateString()}</p>
                            <p>
                              {dailyCheck.checks.filter(c => c.result === 'pass').length} passed, {" "}
                              {dailyCheck.checks.filter(c => c.result === 'warning').length} warnings, {" "}
                              {dailyCheck.checks.filter(c => c.result === 'fail').length} failed
                            </p>
                            <p className="text-xs mt-1 text-muted-foreground">Click to view details</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
            
            {activeCheck && (
              <div className="py-1 grid grid-cols-[180px_1fr] items-center">
                <div className="text-sm text-muted-foreground">
                  Check Details
                </div>
                <div className="bg-white rounded p-2 text-xs border border-gray-100">
                  {(() => {
                    const checkDate = new Date(activeCheck.date);
                    const dailyCheck = asin.agentChecks.find(c => 
                      new Date(c.date).toDateString() === checkDate.toDateString()
                    );
                    
                    if (!dailyCheck) return <p>No checks found for this date</p>;
                    
                    return (
                      <div className="grid grid-cols-3 gap-2">
                        {dailyCheck.checks.map(check => (
                          <div 
                            key={check.id}
                            className={`p-2 rounded border cursor-pointer
                              ${check.id === activeCheck.checkId ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:bg-gray-100'}
                              ${check.result === 'pass' 
                                ? 'text-green-700 border-green-200' 
                                : check.result === 'warning'
                                  ? 'text-yellow-700 border-yellow-200'
                                  : 'text-red-700 border-red-200'
                              }`}
                            onClick={() => setActiveCheck({ 
                              date: activeCheck.date, 
                              checkId: check.id 
                            })}
                          >
                            <div className="flex items-center mb-1">
                              {check.result === 'pass' ? (
                                <Check className="h-3 w-3 mr-1" />
                              ) : check.result === 'warning' ? (
                                <Info className="h-3 w-3 mr-1" />
                              ) : (
                                <X className="h-3 w-3 mr-1" />
                              )}
                              <span className="font-medium truncate">{check.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
            
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnnotationMode(prev => prev === "point" ? "none" : "point");
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
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
      
      {renderCheckDetails()}
    </motion.div>
  );
};

import { AVAILABLE_METRICS } from "./index";

export default AsinRow;
