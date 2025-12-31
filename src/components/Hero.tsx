import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaWhatsapp, FaTelegram, FaDiscord } from "react-icons/fa";
import { useIsMobile } from "@/hooks/use-mobile";
import RotatingText from "./RotatingText";
import SlackIcon from "./SlackIcon";

const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Optimized Mobile View
  if (isMobile) {
    return (
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden" style={{ paddingTop: 'calc(6rem + env(safe-area-inset-top))', paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>
        {/* Background Glows */}
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-indigo-500/20 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-4">
          {/* Main Content with improved spacing */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold leading-[1.3] mb-8 text-white text-center max-w-xs mx-auto"
          >
            The best place to find your perfect{" "}
            <br className="sm:hidden" />
            <RotatingText 
              words={["community", "group", "server"]}
              className="text-center"
              duration={2000}
            />
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-gray-300 mb-10 max-w-md mx-auto leading-relaxed"
          >
            Connect with like-minded people and grow together.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col space-y-5 mb-16 w-full max-w-sm"
          >
            <Button 
              onClick={() => navigate("/communities")}
              className="bg-white text-black py-4 rounded-xl shadow-lg hover:bg-gray-200 font-semibold w-full text-lg"
            >
              Get started
            </Button>
            <Button 
              onClick={() => navigate("/submit")}
              variant="outline"
              className="bg-white/10 text-white border border-white/20 py-4 rounded-xl shadow-lg hover:bg-white/20 backdrop-blur-sm font-semibold w-full text-lg"
            >
              Submit Communities
            </Button>
          </motion.div>

          {/* Platform Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 mb-16"
          >
            <div className="flex items-center space-x-2 text-gray-300">
              <FaWhatsapp className="w-5 h-5" style={{ color: '#25D366' }} />
              <span className="text-sm">WhatsApp</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <FaDiscord className="w-5 h-5" style={{ color: '#5865F2' }} />
              <span className="text-sm">Discord</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <FaTelegram className="w-5 h-5" style={{ color: '#0088cc' }} />
              <span className="text-sm">Telegram</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <SlackIcon className="w-5 h-5" />
              <span className="text-sm">Slack</span>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-full"
          >
            <div className="grid grid-cols-2 gap-y-6">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">50K+</span>
                <span className="text-gray-300 text-xs mt-1">Active Users</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">200+</span>
                <span className="text-gray-300 text-xs mt-1">Communities</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">15+</span>
                <span className="text-gray-300 text-xs mt-1">Categories</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">24/7</span>
                <span className="text-gray-300 text-xs mt-1">Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Desktop View with industry-standard spacing
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden" style={{ paddingTop: 'calc(8rem + env(safe-area-inset-top))', paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl bg-black/20 p-10 sm:p-12 lg:p-14 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-md"
      >
        <div>
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block bg-gray-800 text-gray-300 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-gray-700"
          >
            Discover amazing communities
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.3] mb-8 max-w-5xl tracking-tight text-white mx-auto text-center px-4"
            style={{ wordBreak: 'keep-all', overflowWrap: 'normal' }}
          >
            The best place to find your <span className="whitespace-nowrap">perfect{" "}
            <RotatingText 
              words={["community", "group", "server"]}
              className=""
              duration={2500}
            /></span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Join vibrant communities, connect with like-minded people, and grow together in a space designed for meaningful connections.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-12 md:mb-16 px-4"
          >
            <Button 
              onClick={() => navigate("/communities")}
              className="bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-xl shadow-lg hover:bg-gray-200 transition duration-300 ease-in-out flex items-center space-x-2 font-semibold w-full sm:w-auto text-base md:text-lg"
            >
              <span>Get started</span>
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Button>
            <Button 
              onClick={() => navigate("/submit")}
              variant="outline"
              className="bg-gray-800 text-white border border-gray-700 px-6 py-3 md:px-8 md:py-4 rounded-xl shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out font-semibold w-full sm:w-auto text-base md:text-lg"
            >
              Submit Communities
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 mb-16"
          >
            <div className="flex items-center space-x-2 text-gray-300">
              <FaWhatsapp className="w-5 h-5" style={{ color: '#25D366' }} />
              <span className="text-sm">WhatsApp</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <FaDiscord className="w-5 h-5" style={{ color: '#5865F2' }} />
              <span className="text-sm">Discord</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <FaTelegram className="w-5 h-5" style={{ color: '#0088cc' }} />
              <span className="text-sm">Telegram</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <SlackIcon className="w-5 h-5" />
              <span className="text-sm">Slack</span>
            </div>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="w-full border-t border-white/10 mt-16 pt-12"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">50K+</span>
              <span className="text-gray-300 text-xs sm:text-sm mt-1">Active Users</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">200+</span>
              <span className="text-gray-300 text-xs sm:text-sm mt-1">Communities</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">15+</span>
              <span className="text-gray-300 text-xs sm:text-sm mt-1">Categories</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">24/7</span>
              <span className="text-gray-300 text-xs sm:text-sm mt-1">Support</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
