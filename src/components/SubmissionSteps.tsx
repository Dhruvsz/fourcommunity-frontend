
import { motion } from "framer-motion";
import { MessageSquare, ShieldCheck, Users } from "lucide-react";

const SubmissionSteps = () => {
  const steps = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Submit Your Community",
      description: "Tell us about your group, platform, and members"
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Get Verified",
      description: "Our team reviews and verifies quality communities"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Connect & Grow",
      description: "Reach new members who match your community"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-16 bg-gray-900/30">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Three simple steps to get your community featured and growing
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={item}
              className="flex flex-col items-center bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center"
            >
              <div className="mb-4 p-4 rounded-full bg-gray-800/80 border border-gray-700">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SubmissionSteps;
