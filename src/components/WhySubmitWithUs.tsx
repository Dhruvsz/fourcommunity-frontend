
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Check, Globe, Shield, Users } from "lucide-react";

const WhySubmitWithUs = () => {
  const benefits = [
    {
      icon: <Globe className="h-5 w-5 text-primary" />,
      title: "Targeted Audience",
      description: "Reach people who are actively looking to join communities like yours."
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      title: "Higher Quality Members",
      description: "Our platform attracts engaged, serious community joiners."
    },
    {
      icon: <Shield className="h-5 w-5 text-primary" />,
      title: "Verified Status",
      description: "Stand out with a verified badge after review by our team."
    },
    {
      icon: <Check className="h-5 w-5 text-primary" />,
      title: "Growth Analytics",
      description: "Track your community's growth and engagement metrics."
    }
  ];

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
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-gray-900/30 backdrop-blur-sm">
      <div className="container max-w-6xl">
        <motion.div 
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30">Why List With Us</Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Grow Your Community With Us</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join hundreds of community creators who have found their ideal members through our platform
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-black/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-primary/30 hover:bg-black/80 transition-all shadow-sm hover:shadow-md"
              variants={itemVariants}
            >
              <div className="p-2 inline-flex rounded-full bg-primary/10 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhySubmitWithUs;
