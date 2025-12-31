import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FaWhatsapp, FaTelegram, FaSlack, FaDiscord, FaRocket, FaMicrochip, FaPaintBrush, FaChartLine, FaUsers } from 'react-icons/fa';
import { FiLayers } from "react-icons/fi";
import { BsLayoutTextWindow } from "react-icons/bs";
import { ArrowRight, Loader2 } from 'lucide-react';

const platforms = [
  {
    icon: <FaWhatsapp />,
    name: "WhatsApp",
    desc: "Real-time messaging with encryption",
    stats: "24K+ communities",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: <FaTelegram />,
    name: "Telegram",
    desc: "Powerful features for large communities",
    stats: "32K+ communities",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
  },
  {
    icon: <FaSlack />,
    name: "Slack",
    desc: "Professional workspace",
    stats: "15K+ workspaces",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: <FaDiscord />,
    name: "Discord",
    desc: "Voice, video, and text communication",
    stats: "45K+ servers",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
  },
];

const categories = [
  {
    icon: <FaRocket />,
    name: "Startups",
    desc: "Connect with founders and investors",
    stats: "24.5K+ members",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: <FaMicrochip />,
    name: "Tech",
    desc: "Discuss emerging technologies",
    stats: "68.2K+ members",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: <FaPaintBrush />,
    name: "Creators",
    desc: "For artists and content creators",
    stats: "42.3K+ members",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: <FaChartLine />,
    name: "Finance",
    desc: "Investment strategies and analysis",
    stats: "31.8K+ members",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
];

const InfoCard = ({ icon, name, desc, stats, color, bgColor, isSelected, onClick }: { icon: React.ReactElement, name: string, desc: string, stats: string, color: string, bgColor: string, isSelected: boolean, onClick: () => void }) => (
    <motion.div
        onClick={onClick}
        className={`group p-4 rounded-xl h-full flex flex-col cursor-pointer transition-all duration-300 border ${isSelected ? 'border-sky-400 bg-slate-800/90' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800/90 hover:border-slate-600'}`}
        whileHover={{ y: -4 }}
    >
        <div className="flex items-center mb-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-3 transition-colors duration-300 ${bgColor} ${color}`}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <h4 className="font-bold text-white text-base">{name}</h4>
        </div>
        <p className="text-sm text-slate-400 mb-3 flex-grow">{desc}</p>
        <div className="flex items-center text-sm text-slate-400">
            <FaUsers className="mr-1.5" />
            <span>{stats}</span>
        </div>
    </motion.div>
);

export default function CommunitiesFilter() {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const params = new URLSearchParams();
      if (selectedPlatform) params.append("platform", selectedPlatform);
      if (selectedCategory) params.append("category", selectedCategory);
      navigate(`/communities?${params.toString()}`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="bg-slate-900 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Find Your Community</h2>
          <p className="text-lg text-slate-400 mt-4 max-w-3xl mx-auto">
            Connect with like-minded individuals in specialized communities tailored to your interests and professional needs
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-b from-slate-700 to-slate-800 opacity-20 transform-gpu rotate-1 hidden sm:block -z-0 blur-lg"></div>
          <div className="relative grid md:grid-cols-2 gap-8 bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-700 z-10">
            {/* Platforms Section */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-semibold flex items-center mb-6 text-slate-200">
                <BsLayoutTextWindow className="mr-3 text-slate-400" />
                Choose Platform
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {platforms.map((platform) => (
                  <InfoCard
                    key={platform.name}
                    {...platform}
                    isSelected={selectedPlatform === platform.name}
                    onClick={() => setSelectedPlatform(prev => prev === platform.name ? null : platform.name)}
                  />
                ))}
              </div>
            </div>
            {/* Categories Section */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-semibold flex items-center mb-6 text-slate-200">
                <FiLayers className="mr-3 text-slate-400" />
                Choose Category
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <InfoCard
                    key={category.name}
                    {...category}
                    isSelected={selectedCategory === category.name}
                    onClick={() => setSelectedCategory(prev => prev === category.name ? null : category.name)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="px-10 py-6 text-lg bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-all duration-300 transform hover:scale-105"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-5 w-5" />
              )}
              Explore Communities
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}