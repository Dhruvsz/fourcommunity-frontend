
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Topic {
  name: string;
  emoji: string;
  bgColor: string;
}

const topics: Topic[] = [
  { name: "SaaS", emoji: "💻", bgColor: "bg-orange-50" },
  { name: "Startups", emoji: "🚀", bgColor: "bg-red-50" },
  { name: "Web Tools", emoji: "🔨", bgColor: "bg-purple-50" },
  { name: "Developer Tools", emoji: "🛠️", bgColor: "bg-green-50" },
  { name: "Apps", emoji: "📱", bgColor: "bg-blue-50" },
  { name: "AI Tools", emoji: "🤖", bgColor: "bg-cyan-50" },
  { name: "Web Development", emoji: "🔧", bgColor: "bg-indigo-50" },
  { name: "Email", emoji: "📧", bgColor: "bg-slate-50" },
  { name: "Lifestyle", emoji: "✨", bgColor: "bg-yellow-50" },
  { name: "Project Management", emoji: "📋", bgColor: "bg-amber-50" },
  { name: "Mobile", emoji: "📲", bgColor: "bg-sky-50" },
  { name: "Finance", emoji: "💰", bgColor: "bg-emerald-50" },
];

export const TrendingTopics = () => {
  const navigate = useNavigate();
  
  const handleTopicClick = (topicName: string) => {
    navigate(`/communities?category=${encodeURIComponent(topicName)}`);
  };
  
  return (
    <div className="py-12 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-8 text-center md:text-left">TRENDING TOPICS</h2>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {topics.map((topic, index) => (
            <motion.div
              key={topic.name}
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer ${topic.bgColor} hover:shadow-md transition-all duration-200`}
              whileHover={{ y: -3, scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              onClick={() => handleTopicClick(topic.name)}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-2xl shadow-sm">
                {topic.emoji}
              </div>
              <span className="font-medium truncate">{topic.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TrendingTopics;
