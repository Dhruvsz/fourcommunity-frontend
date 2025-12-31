
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Zap, CheckCircle, Users, Award, Shield } from "lucide-react";

const QuickSubmitForm = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Shield className="h-5 w-5" />, text: "Instant verification badge", color: "text-green-400" },
    { icon: <Users className="h-5 w-5" />, text: "50K+ quality members", color: "text-blue-400" },
    { icon: <Award className="h-5 w-5" />, text: "Priority placement", color: "text-purple-400" },
  ];
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative group"
      >
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Main card */}
        <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl hover:border-white/20 transition-all duration-500">
          
          {/* Floating particles inside card */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Header with animated timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="h-5 w-5 text-blue-400" />
                </motion.div>
                <span className="text-blue-300 font-medium">Takes only 58 seconds</span>
              </motion.div>
            </div>

            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
            >
              Get your community in front of
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                50,000+ verified members
              </span>
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto"
            >
              Join successful community leaders who've grown their membership by <span className="text-green-400 font-semibold">3x</span> through our platform
            </motion.p>
          </motion.div>

          {/* Animated stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-3 gap-6 mb-10"
          >
            {[
              { value: "500+", label: "Communities", color: "from-blue-400 to-cyan-400" },
              { value: "95%", label: "Success Rate", color: "from-green-400 to-emerald-400" },
              { value: "24h", label: "Approval", color: "from-purple-400 to-pink-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center group/stat"
              >
                <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover/stat:scale-110 transition-transform`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features list */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4 mb-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group/feature"
              >
                <div className={`${feature.color} group-hover/feature:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <span className="text-gray-300 group-hover/feature:text-white transition-colors">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/submit/complete")}
              className="w-full h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white text-xl font-bold rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 border-0 relative overflow-hidden group/btn"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative flex items-center justify-center gap-3">
                <Zap className="h-6 w-6" />
                <span>Submit Your Community</span>
                <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400"
            >
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Free to submit • No credit card required • Instant review</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickSubmitForm;
