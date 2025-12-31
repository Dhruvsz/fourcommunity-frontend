
import React from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Shield, Star, ArrowRight, CheckCircle, Clock, Zap, Award, Target } from "lucide-react";

interface SubmitHeroProps {
  title: string;
  description: string;
  onStartSubmission?: () => void;
}

const SubmitHero = ({ title, description, onStartSubmission }: SubmitHeroProps) => {
  const benefits = [
    {
      icon: <Users className="h-7 w-7" />,
      title: "Reach 50K+ Members",
      description: "Connect with our growing network of quality community members",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: "Get Verified Status",
      description: "Build trust with our verification badge and quality standards",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      title: "Grow Your Community",
      description: "Increase engagement and membership with targeted exposure",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Award className="h-7 w-7" />,
      title: "Premium Features",
      description: "Access advanced analytics and community management tools",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "500+", label: "Communities Featured", icon: <Target className="h-5 w-5" /> },
    { number: "50K+", label: "Active Members", icon: <Users className="h-5 w-5" /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp className="h-5 w-5" /> },
    { number: "58s", label: "Avg. Submit Time", icon: <Clock className="h-5 w-5" /> }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-20 md:py-32 relative z-10">
        {/* Hero Header with improved spacing */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-5 w-5 text-yellow-400" />
            </motion.div>
            <span className="text-blue-300 font-medium">✨ Join 500+ Successful Communities</span>
          </motion.div>

          {/* Main Title with improved spacing */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-10 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-[1.1] tracking-tight max-w-5xl mx-auto"
          >
            {title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex justify-center mb-3 text-blue-400 group-hover:text-blue-300 transition-colors">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{stat.number}</div>
                  <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Join the most trusted platform for community discovery. Get featured alongside 
              the best communities and connect with members who are genuinely interested in your niche.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${benefit.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-base leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${benefit.gradient} opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity duration-500 -z-10`}></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Ready to Get Started?</h3>
            </div>
            <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
              Submit your community in just 58 seconds. Our team will review and get back to you within 24 hours.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              onClick={onStartSubmission}
              type="button"
            >
              <span>Start Your Submission</span>
              <ArrowRight className="h-6 w-6" />
            </motion.button>
            <p className="text-gray-400 text-sm mt-6">
              Free to submit • No credit card required • Instant review process
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitHero;
