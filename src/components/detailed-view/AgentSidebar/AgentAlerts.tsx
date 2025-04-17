
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { 
  Bell, 
  CircleCheck, 
  CircleX, 
  AlertTriangle, 
  Inventory, 
  DollarSign, 
  ShoppingCart, 
  MessageSquare, 
  Users, 
  BarChart 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentAlert } from "@/lib/dummy-data";

interface AgentAlertsProps {
  alerts: AgentAlert[];
  onDismiss: (alertId: string) => void;
  onAction: (alertId: string) => void;
}

const AgentAlerts = ({ alerts, onDismiss, onAction }: AgentAlertsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const pendingAlerts = alerts.filter(alert => alert.status === 'pending');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'inventory':
        return <Inventory className="h-5 w-5" />;
      case 'pricing':
        return <DollarSign className="h-5 w-5" />;
      case 'listing':
        return <ShoppingCart className="h-5 w-5" />;
      case 'reviews':
        return <MessageSquare className="h-5 w-5" />;
      case 'competitive':
        return <Users className="h-5 w-5" />;
      case 'advertising':
        return <BarChart className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return "bg-red-100 text-red-800 border-red-200";
      case 'high':
        return "bg-orange-100 text-orange-800 border-orange-200";
      case 'medium':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'low':
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityBadge = (severity: string) => {
    let color;
    switch (severity) {
      case 'critical':
        color = "bg-red-500 hover:bg-red-600";
        break;
      case 'high':
        color = "bg-orange-500 hover:bg-orange-600";
        break;
      case 'medium':
        color = "bg-yellow-500 hover:bg-yellow-600";
        break;
      case 'low':
        color = "bg-blue-500 hover:bg-blue-600";
        break;
      default:
        color = "bg-gray-500 hover:bg-gray-600";
    }
    
    return (
      <Badge className={`${color} capitalize`}>
        {severity}
      </Badge>
    );
  };

  // Format the date to be more human-readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between p-2 bg-secondary/30 rounded-md cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-amber-500" />
          <h3 className="font-medium">Agent Alerts</h3>
          {pendingAlerts.length > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600">{pendingAlerts.length}</Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}>
          {isExpanded ? "Hide" : "Show"}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2 mt-2 overflow-hidden"
          >
            {pendingAlerts.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                No pending alerts at this time
              </div>
            ) : (
              pendingAlerts.map((alert) => (
                <Alert 
                  key={alert.id} 
                  className={`relative ${getSeverityColor(alert.severity)} transition-all duration-200 hover:shadow-md`}
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-2">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <AlertTitle className="text-sm font-medium">{alert.title}</AlertTitle>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <AlertDescription className="mt-1 text-xs">
                        {alert.description}
                      </AlertDescription>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(alert.date)}
                        </span>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => onDismiss(alert.id)}
                          >
                            <CircleX className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-green-500 hover:text-green-600 hover:bg-green-50"
                            onClick={() => onAction(alert.id)}
                          >
                            <CircleCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Alert>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentAlerts;
