
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
    <div className="min-h-screen bg-black flex w-full" ref={containerRef}>
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            onClick={toggleSidebar}
            variant="outline"
            size="icon"
            className="bg-gray-800/80 border-gray-700/60 hover:bg-gray-700/80 hover:border-gray-600/60 text-gray-300"
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
            } top-0 left-0 z-40 h-screen w-64 bg-[#1C1C1F] border-r border-gray-700/40 shadow-lg flex flex-col`}
          >
            <div className="p-6 border-b border-gray-700/40">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="text-xl font-bold text-white">FourCommunity</div>
                  <div className="text-xs text-blue-400 font-medium tracking-wider">ADMIN CONTROL</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                <p className="admin-secondary-text text-sm">System Operational</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <form onSubmit={handleSearch} className="px-2 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search operations..."
                    className="pl-9 bg-gray-800/50 border-gray-700/60 text-gray-200 placeholder-gray-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              
              {/* Navigation */}
              <div className="my-3 px-3">
                <h3 className="admin-card-label">Control Center</h3>
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
                        flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isActive 
                          ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500 shadow-lg shadow-blue-500/20' 
                          : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'}
                      `}
                      onClick={() => {
                        if (isMobile) {
                          setIsSidebarOpen(false);
                        }
                      }}
                    >
                      <span className="mr-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="font-semibold">{item.name}</span>
                      <ChevronRight size={16} className="ml-auto opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-700/40 p-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span className="font-semibold">Logout</span>
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
        <div className="flex-1 p-6 lg:p-8 overflow-auto pt-16 lg:pt-8 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="admin-section-title mb-2">
                {location.pathname.includes('/dashboard/communities') ? 'Communities Control' : 
                 location.pathname.includes('/dashboard/analytics') ? 'Analytics Center' :
                 location.pathname.includes('/dashboard/settings') ? 'System Settings' : 'Mission Control'}
              </h1>
              <div className="flex items-center text-sm">
                <div className="admin-secondary-text">Operations Dashboard</div>
                <div className="h-1 w-1 bg-gray-600 rounded-full mx-3" />
                <div className="text-green-400 font-medium">LIVE</div>
              </div>
            </div>
            <div className="admin-secondary-text text-sm">
              Last sync: {new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
