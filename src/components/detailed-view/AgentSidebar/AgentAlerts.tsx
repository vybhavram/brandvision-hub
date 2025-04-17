
import React from "react";
import { AlertCircle, Info, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Alert {
  id: string;
  title: string;
  description: string;
  category: 'inventory' | 'pricing' | 'listing' | 'reviews' | 'competitive' | 'advertising';
  date: string;
}

interface AgentAlertsProps {
  alerts: Alert[];
  onDismiss: (alertId: string) => void;
}

const AgentAlerts: React.FC<AgentAlertsProps> = ({ alerts, onDismiss }) => {
  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    
    return date.toLocaleDateString();
  };
  
  // Get alert icon and color based on alert type
  const getAlertStyles = (category: Alert['category']) => {
    switch (category) {
      case 'inventory':
        return { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-50' };
      case 'pricing':
        return { icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-50' };
      case 'competitive':
        return { icon: AlertCircle, color: 'text-orange-500', bgColor: 'bg-orange-50' };
      case 'listing':
        return { icon: Info, color: 'text-violet-500', bgColor: 'bg-violet-50' };
      case 'reviews':
        return { icon: AlertCircle, color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
      case 'advertising':
        return { icon: Info, color: 'text-green-500', bgColor: 'bg-green-50' };
      default:
        return { icon: Info, color: 'text-gray-500', bgColor: 'bg-gray-50' };
    }
  };
  
  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recent Alerts</h3>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No alerts at the moment
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const { icon: AlertIcon, color, bgColor } = getAlertStyles(alert.category);
              
              return (
                <div 
                  key={alert.id}
                  className="relative rounded-lg border p-4 shadow-sm hover:shadow transition-shadow"
                >
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full opacity-50 hover:opacity-100"
                      onClick={() => onDismiss(alert.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${bgColor} ${color}`}>
                      <AlertIcon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{alert.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.description}
                      </p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(alert.date)}
                        </span>
                        
                        <Button variant="ghost" size="sm" className="h-7 gap-1">
                          <span className="text-xs">View Details</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default AgentAlerts;
