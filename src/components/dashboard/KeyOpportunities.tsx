
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Lightbulb, AlertTriangle, TrendingUp, TrendingDown, Box, AlertCircle, BarChart4 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample opportunities and risks data
const opportunitiesAndRisks = [
  {
    type: "opportunity",
    title: "High demand, low competition ASIN",
    description: "B08DEF5678 has high search volume but only 2 competitors with low ratings.",
    icon: TrendingUp,
    iconClass: "text-green-500 bg-green-50",
  },
  {
    type: "opportunity",
    title: "Competitor stockout detected",
    description: "Main competitor for B07XYZ1234 has been out of stock for 7+ days.",
    icon: Box,
    iconClass: "text-blue-500 bg-blue-50",
  },
  {
    type: "risk",
    title: "Declining category trend",
    description: "5% month-over-month decline in the wireless accessories category.",
    icon: TrendingDown,
    iconClass: "text-red-500 bg-red-50",
  },
  {
    type: "risk",
    title: "Potential policy compliance issue",
    description: "Product packaging for B09AB23CD may not meet updated requirements.",
    icon: AlertCircle,
    iconClass: "text-amber-500 bg-amber-50",
  }
];

const KeyOpportunities = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Key Opportunities & Risks</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {opportunitiesAndRisks.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-start p-3 rounded-lg bg-white border hover:shadow-sm transition-shadow"
            >
              <div className={`flex-shrink-0 p-2 rounded-full ${item.iconClass} mr-3`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  {item.type === "opportunity" ? (
                    <Lightbulb className="h-4 w-4 text-green-500 mr-1.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-1.5" />
                  )}
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                <Button variant="ghost" size="sm" className="h-7 text-xs pl-0 mt-1">
                  Analyze
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyOpportunities;
