
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ArrowDown, ArrowUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sample PED data
const pedData = [
  {
    asin: "B08CZHT2LK",
    title: "Premium Wireless Earbuds",
    defects: 3,
    status: "high",
    change: "increased",
    value: "+2"
  },
  {
    asin: "B07XYZ1234",
    title: "Bluetooth Speaker Portable",
    defects: 1,
    status: "low",
    change: "decreased",
    value: "-1"
  },
  {
    asin: "B09AB23CD",
    title: "Wireless Phone Charger",
    defects: 4,
    status: "high",
    change: "increased",
    value: "+1"
  },
  {
    asin: "B08DEF5678",
    title: "HD Webcam with Microphone",
    defects: 0,
    status: "none",
    change: "stable",
    value: "0"
  },
  {
    asin: "B07GHI9012",
    title: "Bluetooth Gaming Controller",
    defects: 2,
    status: "medium",
    change: "decreased",
    value: "-2"
  }
];

const PEDStatusTracker = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">PED Status Tracker</CardTitle>
          <div className="flex items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ASINs..."
                className="w-60 h-9 pl-8 text-sm"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="overflow-auto max-h-80"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[110px]">ASIN</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-center w-[90px]">Defects</TableHead>
                <TableHead className="text-center w-[90px]">Status</TableHead>
                <TableHead className="text-center w-[90px]">Trend</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedData.map((item, index) => (
                <motion.tr
                  key={item.asin}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="hover:bg-secondary/40"
                >
                  <TableCell className="font-medium">{item.asin}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={item.title}>{item.title}</TableCell>
                  <TableCell className="text-center">{item.defects}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${item.status === "high" 
                            ? "bg-red-50 text-red-600 border-red-200" 
                            : item.status === "medium" 
                              ? "bg-amber-50 text-amber-600 border-amber-200" 
                              : item.status === "low" 
                                ? "bg-green-50 text-green-600 border-green-200"
                                : "bg-gray-50 text-gray-600 border-gray-200"
                          }
                        `}
                      >
                        {item.status === "none" ? "Clear" : item.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center">
                      {item.change === "increased" ? (
                        <div className="flex items-center text-red-600">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          {item.value}
                        </div>
                      ) : item.change === "decreased" ? (
                        <div className="flex items-center text-green-600">
                          <ArrowDown className="h-4 w-4 mr-1" />
                          {item.value}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PEDStatusTracker;
