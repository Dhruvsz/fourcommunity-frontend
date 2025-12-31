import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, Search } from "lucide-react";
import SearchBar from "./SearchBar";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isSubmitPage = location.pathname.startsWith('/submit');

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scrolled state for styling
      setIsScrolled(currentScrollY > 10);
      
      // Only hide/show on mobile
      if (isMobile) {
        if (currentScrollY < lastScrollY || currentScrollY < 100) {
          // Scrolling up or near top - show navbar
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past 100px - hide navbar
          setIsVisible(false);
          setMobileMenuOpen(false); // Close mobile menu when hiding
        }
      } else {
        // Always visible on desktop
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobile]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header 
      className={`fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'md:translate-y-0 -translate-y-full'
      } ${
        isScrolled 
          ? 'bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20' 
          : (isHomePage || isSubmitPage)
            ? 'bg-black/10 backdrop-blur-md border-b border-white/5' 
            : 'bg-black/20 backdrop-blur-xl border-b border-white/10'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 flex items-center justify-center py-3 md:py-4 lg:py-5">
        <div className="flex items-center justify-between w-full max-w-7xl gap-2 md:gap-4">
          <Link to="/" className="flex items-center flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="flex items-center">
                {/* Logo - Responsive sizing */}
                <div className="h-7 w-auto sm:h-8 md:h-9 lg:h-12 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Four Community"
                    className="h-full w-auto object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </Link>
          
          {/* Desktop & Tablet navigation - Hidden on mobile only */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8">
            <Link to="/communities" className="text-gray-300 hover:text-white transition-colors font-medium text-sm lg:text-base whitespace-nowrap">
              Communities
            </Link>
            <Link to="/faq" className="text-gray-300 hover:text-white transition-colors font-medium text-sm lg:text-base whitespace-nowrap">
              FAQ
            </Link>
            <button className="text-gray-300 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-2 lg:gap-4">
              <Link
                to="/account"
                className="flex items-center gap-1.5 lg:gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-2 lg:px-5 lg:py-2.5 rounded-lg transition-all duration-200 font-medium text-sm lg:text-base whitespace-nowrap"
              >
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-5 h-5 lg:w-6 lg:h-6 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <span className="text-xs lg:text-sm">Account</span>
              </Link>
              <button
                onClick={signOut}
                className="text-gray-300 hover:text-white transition-colors text-xs lg:text-sm font-medium whitespace-nowrap"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 lg:gap-4">
              <Link
                to="/submit"
                className="text-gray-300 hover:text-white transition-colors font-medium text-sm lg:text-base whitespace-nowrap hidden lg:block"
              >
                Submit Group
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 lg:px-5 lg:py-2.5 rounded-lg transition-colors font-medium text-sm lg:text-base whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
          )}
            <Link
              to="/submit-group"
              className="bg-white text-black px-3 py-2 lg:px-5 lg:py-2.5 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm lg:text-base whitespace-nowrap"
            >
              Submit Group
            </Link>
          </div>
        </div>
        
          {/* Mobile menu button and search */}
          <div className="md:hidden flex items-center gap-2">
            <div className="hidden xs:block">
              <SearchBar />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white p-2"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="text-white h-5 w-5" /> : <Menu className="text-white h-5 w-5" />}
            </Button>
          </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg shadow-lg p-4 flex flex-col gap-3 border-t border-gray-800 mx-4 rounded-b-lg"
          >
            <div className="xs:hidden mb-2">
              <SearchBar />
            </div>
            <Link 
              to="/communities"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-md ${
                location.pathname === '/communities' 
                  ? 'bg-primary/20 text-white' 
                  : 'text-white hover:bg-gray-800 hover:text-gray-300'
              }`}
            >
              Communities
            </Link>
            <a 
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-md text-white hover:bg-gray-800 hover:text-gray-300"
            >
              FAQ
            </a>
            
            {/* Mobile Auth Links */}
            {isAuthenticated ? (
              <Link 
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-white hover:bg-gray-800 hover:text-gray-300"
              >
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                Account
              </Link>
            ) : (
              <>
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-md text-white hover:bg-gray-800 hover:text-gray-300 text-center"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-center transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
            
            <Link 
              to="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-md bg-white text-black hover:bg-gray-100 text-center transition-colors text-base font-medium"
            >
              Submit Group
            </Link>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
