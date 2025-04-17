
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

// Sample data
const kpiData = [
  {
    name: "Revenue",
    value: "$842,512",
    change: "+5.2%",
    trend: [4200, 4500, 4300, 4700, 4900, 5100, 5400],
    isPositive: true,
  },
  {
    name: "Units Sold",
    value: "24,513",
    change: "+2.1%",
    trend: [1200, 1250, 1200, 1300, 1350, 1400, 1450],
    isPositive: true,
  },
  {
    name: "Margin %",
    value: "32.4%",
    change: "-0.8%",
    trend: [34, 33.5, 33, 32.8, 32.5, 32.4, 32.4],
    isPositive: false,
  },
  {
    name: "Ad Spend",
    value: "$105,420",
    change: "+12.3%",
    trend: [8000, 8500, 9000, 9200, 9500, 10000, 10500],
    isPositive: false,
  },
];

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  plugins: {
    tooltip: {
      enabled: false,
    },
    legend: {
      display: false,
    },
  },
  elements: {
    point: {
      radius: 0,
    },
    line: {
      tension: 0.4,
    },
  },
};

const BrandHealthSnapshot = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Brand Health Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm text-muted-foreground">{kpi.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    kpi.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {kpi.change}
                  </span>
                </div>
                <div className="text-xl font-semibold">{kpi.value}</div>
                <div className="h-10 mt-2">
                  <Line
                    data={{
                      labels: ["", "", "", "", "", "", ""],
                      datasets: [
                        {
                          data: kpi.trend,
                          borderColor: kpi.isPositive ? "#10b981" : "#ef4444",
                          borderWidth: 2,
                          fill: true,
                          backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 50);
                            gradient.addColorStop(0, kpi.isPositive ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)");
                            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
                            return gradient;
                          },
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandHealthSnapshot;
