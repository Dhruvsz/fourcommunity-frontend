
import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mobile view
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "🔐 Logged out",
        description: "You have been successfully logged out. Stay secure!",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search",
        description: `Searching for: ${searchQuery}`,
      });
      // Implement actual search functionality here
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, name: "Dashboard", path: "/admin/dashboard" },
    { icon: <ClipboardList className="h-5 w-5" />, name: "Communities", path: "/admin/dashboard/communities" },
    { icon: <Users className="h-5 w-5" />, name: "Analytics", path: "/admin/dashboard/analytics" },
    { icon: <Settings className="h-5 w-5" />, name: "Settings", path: "/admin/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex w-full" ref={containerRef}>
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            onClick={toggleSidebar}
            variant="outline"
            size="icon"
            className="bg-gray-900 border-gray-800 hover:bg-gray-800 hover:border-gray-700"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -280 } : { x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${
              isMobile ? "fixed" : "sticky"
            } top-0 left-0 z-40 h-screen w-64 bg-[#111111] border-r border-gray-800 shadow-lg backdrop-blur-lg bg-opacity-95 flex flex-col`}
          >
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="text-xl font-semibold text-white">FourCommunity</div>
                  <motion.div
                    animate={{ 
                      opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -inset-2 rounded-full bg-primary/20 blur-md -z-10"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                <p className="text-sm text-gray-400">Admin Panel</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="px-2 mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search..."
                    className="pl-8 bg-[#1A1A1A] border-gray-800 text-gray-300 focus-visible:ring-primary/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              
              {/* Navigation */}
              <div className="my-2 px-3">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</h3>
              </div>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <motion.li 
                    key={item.name}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center px-4 py-3 rounded-lg transition-all duration-300
                        ${isActive 
                          ? 'bg-[#1A1A1A] text-primary border-l-2 border-primary shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                          : 'text-gray-400 hover:bg-[#1A1A1A]/70 hover:text-gray-200'}
                      `}
                      onClick={() => {
                        if (isMobile) {
                          setIsSidebarOpen(false);
                        }
                      }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                      <ChevronRight size={16} className="ml-auto opacity-70" />
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-800 p-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:bg-[#1A1A1A]/80 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Overlay for mobile when sidebar is open */}
        <AnimatePresence>
          {isSidebarOpen && isMobile && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        
        {/* Content area */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto pt-16 lg:pt-8 bg-gradient-to-b from-[#111111] to-[#0D0D0D]">
          <div className="mb-6 flex items-center">
            <h1 className="text-2xl font-semibold text-white">
              {location.pathname.includes('/dashboard/communities') ? 'Communities' : 
               location.pathname.includes('/dashboard/analytics') ? 'Analytics' :
               location.pathname.includes('/dashboard/settings') ? 'Settings' : 'Dashboard'}
            </h1>
            <div className="h-1 w-1 bg-gray-500 rounded-full mx-3" />
            <div className="text-sm text-gray-400">
              Admin Panel
            </div>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
