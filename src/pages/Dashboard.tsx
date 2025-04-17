
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import BrandHealthSnapshot from "@/components/dashboard/BrandHealthSnapshot";
import AlertsAndRisks from "@/components/dashboard/AlertsAndRisks";
import ListingHealthMonitor from "@/components/dashboard/ListingHealthMonitor";
import PPCOverview from "@/components/dashboard/PPCOverview";
import CompetitiveView from "@/components/dashboard/CompetitiveView";
import PEDStatusTracker from "@/components/dashboard/PEDStatusTracker";
import KeyOpportunities from "@/components/dashboard/KeyOpportunities";
import DataReliabilityStatus from "@/components/dashboard/DataReliabilityStatus";

const Dashboard = () => {
  // Animation variants for staggered loading of widgets
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid gap-4 md:gap-6"
      >
        {/* First row - Brand Health Snapshot takes full width */}
        <motion.div variants={itemVariants}>
          <BrandHealthSnapshot />
        </motion.div>

        {/* Second row - Split between Alerts & Risks and Listing Health Monitor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div variants={itemVariants}>
            <AlertsAndRisks />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ListingHealthMonitor />
          </motion.div>
        </div>

        {/* Third row - PPC Overview takes full width */}
        <motion.div variants={itemVariants}>
          <PPCOverview />
        </motion.div>

        {/* Fourth row - Split between Competitive View and PED Status Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div variants={itemVariants}>
            <CompetitiveView />
          </motion.div>
          <motion.div variants={itemVariants}>
            <PEDStatusTracker />
          </motion.div>
        </div>

        {/* Fifth row - Split between Key Opportunities and Data Reliability Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div variants={itemVariants}>
            <KeyOpportunities />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DataReliabilityStatus />
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;
