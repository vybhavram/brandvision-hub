
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import DetailedViewTable from "@/components/detailed-view/DetailedViewTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, ChevronDown, Download, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const DetailedView = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Bar with controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Brand Detailed View</h1>
              <p className="text-sm text-muted-foreground">
                In-depth analysis of ASINs and their performance metrics
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 Days
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Select ASIN" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ASINs</SelectItem>
                <SelectItem value="B08MASTER">B08MASTER</SelectItem>
                <SelectItem value="B07XYZ1234">B07XYZ1234</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Parent ASIN: B08MASTER
          </Badge>
          <Badge variant="outline" className="bg-secondary/50">
            3 Child ASINs
          </Badge>
          <Badge variant="outline" className="bg-secondary/50">
            Data Updated: 30 min ago
          </Badge>
        </div>
        
        {/* Detailed View Table */}
        <DetailedViewTable />
      </motion.div>
    </MainLayout>
  );
};

export default DetailedView;
