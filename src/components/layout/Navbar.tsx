
import { Bell, ChevronDown, Menu, Search, Share2, User } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-16 items-center px-4 md:px-6 max-w-[1600px] mx-auto">
        {/* Logo */}
        <div className="flex mr-8">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-primary">BrandSync</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mr-6">
          <Link 
            to="/" 
            className="text-sm font-medium transition-colors border-b-2 border-primary py-1"
          >
            Health Dashboard
          </Link>
          <Link 
            to="/detailed-view" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Brand Detailed View
          </Link>
        </nav>

        {/* Portfolio Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="hidden md:flex h-9 w-36 justify-between items-center"
            >
              <span className="truncate">My Portfolio</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            <DropdownMenuItem>Portfolio 1</DropdownMenuItem>
            <DropdownMenuItem>Portfolio 2</DropdownMenuItem>
            <DropdownMenuItem>Portfolio 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Search / Query Bar */}
        <div className="relative hidden md:flex w-full max-w-sm items-center lg:max-w-md mx-4">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Ask about your brand..." 
            className="w-full pl-8 bg-white" 
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 md:space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            aria-label="Shared Intelligence Hub"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="rounded-full h-8 w-8 p-0 ml-1"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>BM</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
