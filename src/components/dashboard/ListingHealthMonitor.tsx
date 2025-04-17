
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// Sample data for listing statuses
const listingStatuses = {
  active: 76,
  suppressed: 5,
  inactive: 3
};

// Sample data for ASINs
const asins = [
  {
    asin: "B08CZHT2LK",
    title: "Premium Wireless Earbuds",
    buyBoxPercentage: 98,
    contentScore: 92,
    rating: 4.5,
    status: "active"
  },
  {
    asin: "B07XYZ1234",
    title: "Bluetooth Speaker Portable",
    buyBoxPercentage: 100,
    contentScore: 87,
    rating: 4.7,
    status: "active"
  },
  {
    asin: "B09AB23CD",
    title: "Wireless Phone Charger",
    buyBoxPercentage: 0,
    contentScore: 65,
    rating: 3.9,
    status: "suppressed"
  },
  {
    asin: "B08DEF5678",
    title: "HD Webcam with Microphone",
    buyBoxPercentage: 92,
    contentScore: 95,
    rating: 4.8,
    status: "active"
  }
];

const ListingHealthMonitor = () => {
  // Chart data
  const chartData = {
    labels: ['Active', 'Suppressed', 'Inactive'],
    datasets: [
      {
        data: [listingStatuses.active, listingStatuses.suppressed, listingStatuses.inactive],
        backgroundColor: ['#10b981', '#f59e0b', '#6b7280'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Listing Health Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="h-48 w-48 relative">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold">{listingStatuses.active + listingStatuses.suppressed + listingStatuses.inactive}</div>
                  <div className="text-xs text-muted-foreground">Total Listings</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="overflow-auto max-h-64"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">ASIN</TableHead>
                  <TableHead>Buy Box %</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {asins.map((asin) => (
                  <TableRow key={asin.asin}>
                    <TableCell className="font-medium">
                      {asin.asin}
                      <Badge 
                        variant="outline" 
                        className={`ml-1 px-1 py-0 text-[10px] ${
                          asin.status === 'active' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : asin.status === 'suppressed'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {asin.status === 'active' ? 'A' : asin.status === 'suppressed' ? 'S' : 'I'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`text-sm ${
                        asin.buyBoxPercentage < 90 
                          ? 'text-amber-600' 
                          : asin.buyBoxPercentage === 0 
                            ? 'text-red-600' 
                            : 'text-green-600'
                      }`}>
                        {asin.buyBoxPercentage}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div 
                          className="h-2 w-full max-w-16 bg-gray-200 rounded-full overflow-hidden mr-1"
                        >
                          <div 
                            className={`h-full ${
                              asin.contentScore < 70 
                                ? 'bg-red-500' 
                                : asin.contentScore < 85 
                                  ? 'bg-amber-500' 
                                  : 'bg-green-500'
                            }`}
                            style={{ width: `${asin.contentScore}%` }}
                          />
                        </div>
                        <span className="text-xs">{asin.contentScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>{asin.rating.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingHealthMonitor;
