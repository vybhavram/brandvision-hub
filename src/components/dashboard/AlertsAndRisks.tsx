
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample data for alerts
const alerts = [
  {
    id: 1,
    type: "critical",
    title: "Listing Suppressed",
    description: "Listing B08CZHT2LK has been suppressed due to content compliance issues.",
    time: "10 min ago",
  },
  {
    id: 2,
    type: "warning",
    title: "Low Inventory Alert",
    description: "SKU A4567-B inventory below reorder point. 3 days of stock remaining.",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "warning",
    title: "Negative Review Spike",
    description: "4 new 1-star reviews in the last 24 hours on ASIN B07HRJM1VQ.",
    time: "4 hours ago",
  },
  {
    id: 4,
    type: "info",
    title: "Price Change Alert",
    description: "Competitor lowered price by 12% on comparable ASIN B08GKY3P1K.",
    time: "Yesterday",
  },
];

const AlertsAndRisks = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Alerts & Risks</CardTitle>
          <Badge variant="outline" className="ml-2">
            {alerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-start p-3 rounded-lg bg-white border hover:shadow-sm transition-shadow"
            >
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {alert.type === "critical" ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : alert.type === "warning" ? (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-foreground">{alert.title}</p>
                  <span className="text-xs text-muted-foreground ml-2">{alert.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                <div className="flex items-center mt-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs mr-2">
                    Resolve
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs pl-2 pr-1">
                    Details
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-sm font-medium">All clear!</p>
              <p className="text-xs text-muted-foreground mt-1">No active alerts at the moment</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsAndRisks;
