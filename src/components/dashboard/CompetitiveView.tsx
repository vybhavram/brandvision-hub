
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Maximize2 } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Sample competitive data
const competitiveData = {
  shareOfVoice: {
    labels: ["Your Brand", "Competitor A", "Competitor B", "Competitor C"],
    data: [42, 28, 18, 12]
  },
  priceIndex: {
    labels: ["Your Brand", "Competitor A", "Competitor B", "Competitor C"],
    data: [100, 92, 105, 88]
  },
  buyBoxWin: {
    labels: ["Your Brand", "Competitor A", "Competitor B", "Competitor C"],
    data: [85, 75, 92, 70]
  }
};

const CompetitiveView = () => {
  // Share of Voice Chart data
  const shareOfVoiceData = {
    labels: competitiveData.shareOfVoice.labels,
    datasets: [
      {
        label: "Share of Voice (%)",
        data: competitiveData.shareOfVoice.data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  // Price Index Chart data
  const priceIndexData = {
    labels: competitiveData.priceIndex.labels,
    datasets: [
      {
        label: "Price Index (your brand = 100)",
        data: competitiveData.priceIndex.data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  // Buy Box Win Rate Chart data
  const buyBoxWinData = {
    labels: competitiveData.buyBoxWin.labels,
    datasets: [
      {
        label: "Buy Box Win Rate (%)",
        data: competitiveData.buyBoxWin.data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
              if (context.dataset.label.includes('%') || context.dataset.label.includes('Rate')) {
                label += '%';
              }
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Competitive View</CardTitle>
          <div className="flex items-center space-x-2">
            <Select defaultValue="shareOfVoice">
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shareOfVoice">Share of Voice</SelectItem>
                <SelectItem value="priceIndex">Price Index</SelectItem>
                <SelectItem value="buyBoxWin">Buy Box Win Rate</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-72"
        >
          <Bar data={shareOfVoiceData} options={chartOptions} />
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default CompetitiveView;
