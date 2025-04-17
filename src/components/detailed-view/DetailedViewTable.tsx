
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Metric {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface ChildAsin {
  asin: string;
  title: string;
  metrics: Metric[];
}

interface ParentAsin {
  asin: string;
  title: string;
  children: ChildAsin[];
}

// Sample days for the timeline
const days = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

// Sample parent ASIN data
const parentAsin: ParentAsin = {
  asin: "B08MASTER",
  title: "Premium Wireless Audio Collection",
  children: [
    {
      asin: "B08CZHT2LK",
      title: "Premium Wireless Earbuds - Black",
      metrics: [
        { name: "Revenue", value: "$12,845.00", change: "+8.2%", isPositive: true },
        { name: "Units Sold", value: "423", change: "+5.1%", isPositive: true },
        { name: "Sessions", value: "3,452", change: "+12.3%", isPositive: true },
        { name: "Conversion Rate", value: "12.2%", change: "-0.8%", isPositive: false },
        { name: "PPC Spend", value: "$1,245.00", change: "+15.2%", isPositive: false },
        { name: "ACoS", value: "9.7%", change: "+2.1%", isPositive: false },
        { name: "TACoS", value: "7.2%", change: "-0.5%", isPositive: true }
      ]
    },
    {
      asin: "B08WHTE78P",
      title: "Premium Wireless Earbuds - White",
      metrics: [
        { name: "Revenue", value: "$9,732.00", change: "+3.5%", isPositive: true },
        { name: "Units Sold", value: "305", change: "+2.1%", isPositive: true },
        { name: "Sessions", value: "2,845", change: "+8.7%", isPositive: true },
        { name: "Conversion Rate", value: "10.7%", change: "+0.3%", isPositive: true },
        { name: "PPC Spend", value: "$985.00", change: "+5.2%", isPositive: false },
        { name: "ACoS", value: "10.1%", change: "-0.3%", isPositive: true },
        { name: "TACoS", value: "8.2%", change: "-0.2%", isPositive: true }
      ]
    },
    {
      asin: "B08SPKR78K",
      title: "Premium Wireless Speaker - Black",
      metrics: [
        { name: "Revenue", value: "$22,156.00", change: "+12.8%", isPositive: true },
        { name: "Units Sold", value: "287", change: "+9.2%", isPositive: true },
        { name: "Sessions", value: "4,287", change: "+18.5%", isPositive: true },
        { name: "Conversion Rate", value: "6.7%", change: "-1.2%", isPositive: false },
        { name: "PPC Spend", value: "$2,485.00", change: "+22.1%", isPositive: false },
        { name: "ACoS", value: "11.2%", change: "+1.8%", isPositive: false },
        { name: "TACoS", value: "9.1%", change: "+0.7%", isPositive: false }
      ]
    }
  ]
};

const DetailedViewTable = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const maxScroll = 1200; // Adjust based on your content width

  const handleScrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 200));
  };

  const handleScrollRight = () => {
    setScrollPosition(Math.min(maxScroll, scrollPosition + 200));
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-secondary/30">
        <div className="flex items-center">
          <ChevronRight className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <h2 className="text-lg font-semibold">{parentAsin.asin}</h2>
            <p className="text-sm text-muted-foreground">{parentAsin.title}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="p-4">
          {parentAsin.children.map((child, childIndex) => (
            <motion.div
              key={child.asin}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: childIndex * 0.1, duration: 0.3 }}
              className="mb-8 last:mb-0"
            >
              <div className="mb-3 pb-2 border-b">
                <div className="flex items-center">
                  <h3 className="text-md font-medium">{child.asin}</h3>
                  <span className="ml-2 text-sm text-muted-foreground">{child.title}</span>
                </div>
              </div>

              <div className="mb-4">
                {child.metrics.map((metric, metricIndex) => (
                  <div 
                    key={`${child.asin}-${metric.name}`} 
                    className="grid grid-cols-[200px_150px] mb-3 last:mb-0"
                  >
                    <div className="font-medium text-sm">{metric.name}</div>
                    <div className="flex items-center">
                      <span className="font-medium">{metric.value}</span>
                      <span 
                        className={`text-xs ml-2 ${
                          metric.isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="absolute -left-4 flex items-center h-full z-10">
                  <button
                    onClick={handleScrollLeft}
                    disabled={scrollPosition <= 0}
                    className="p-1 rounded-full bg-white shadow-md disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute -right-4 flex items-center h-full z-10">
                  <button
                    onClick={handleScrollRight}
                    disabled={scrollPosition >= maxScroll}
                    className="p-1 rounded-full bg-white shadow-md disabled:opacity-50"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div 
                  className="overflow-x-auto hide-scrollbar pb-4 pt-2"
                  style={{
                    maxWidth: "calc(100% - 30px)",
                    margin: "0 auto"
                  }}
                >
                  <div 
                    className="min-w-max transition-transform duration-300"
                    style={{
                      transform: `translateX(-${scrollPosition}px)`
                    }}
                  >
                    {/* Timeline row */}
                    <div className="flex border-t border-b py-2 mb-2">
                      <div className="w-16 flex-shrink-0 font-semibold text-xs text-center">
                        Timeline
                      </div>
                      {days.map((day, i) => (
                        <div 
                          key={`day-${i}`} 
                          className={`w-20 text-center text-xs ${
                            i === days.length - 1 ? 'font-semibold' : ''
                          }`}
                        >
                          {day}
                          {i === days.length - 1 && (
                            <div className="text-[10px] text-muted-foreground">Today</div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Time markers */}
                    <div className="h-6 relative mb-4">
                      {days.map((_, i) => (
                        <div 
                          key={`marker-${i}`}
                          className={`absolute h-6 border-l ${
                            i === days.length - 1 ? 'border-primary border-dashed' : 'border-gray-200'
                          }`}
                          style={{ left: `${i * 80 + 16}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DetailedViewTable;
