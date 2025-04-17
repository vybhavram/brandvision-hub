
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Sample data for PPC metrics
const ppcData = {
  spend: "$24,512",
  sales: "$98,745",
  acos: "24.8%",
  tacos: "11.2%",
  trend: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    spend: [15000, 17500, 19200, 21000, 22500, 24000, 24500],
    sales: [55000, 63000, 68000, 75000, 82000, 90000, 98700]
  }
};

const PPCOverview = () => {
  // Chart data
  const chartData = {
    labels: ppcData.trend.labels,
    datasets: [
      {
        label: "Spend",
        data: ppcData.trend.spend,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: "Sales",
        data: ppcData.trend.sales,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Spend ($)',
          font: {
            size: 10
          }
        },
        min: 0,
        max: 30000,
        ticks: {
          callback: function(value: any) {
            return '$' + (value / 1000) + 'K';
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Sales ($)',
          font: {
            size: 10
          }
        },
        min: 0,
        max: 120000,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          callback: function(value: any) {
            return '$' + (value / 1000) + 'K';
          }
        }
      }
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">PPC & Promotions Overview</CardTitle>
          <Badge variant="outline">
            Last 30 days
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Ad Spend", value: ppcData.spend },
            { label: "Ad Sales", value: ppcData.sales },
            { label: "ACoS", value: ppcData.acos },
            { label: "TACoS", value: ppcData.tacos }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex flex-col bg-secondary/50 p-3 rounded-lg"
            >
              <div className="text-sm text-muted-foreground mb-1 flex items-center">
                {metric.label}
                <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground" />
              </div>
              <div className="text-xl font-semibold">{metric.value}</div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="h-60"
        >
          <Line data={chartData} options={chartOptions} />
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PPCOverview;
