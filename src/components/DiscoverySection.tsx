import React from "react";
import { FaSearch, FaBell, FaUserFriends, FaSlidersH, FaWhatsapp, FaDiscord, FaTelegram, FaSlack, FaUsers } from "react-icons/fa";

const features = [
  {
    name: "Advanced Search",
    description: "Find exactly what you're looking for with powerful filters.",
    icon: <FaSearch />,
  },
  {
    name: "Instant Notifications",
    description: "Stay updated with real-time alerts from your communities.",
    icon: <FaBell />,
  },
  {
    name: "Connect with Peers",
    description: "Build your network with like-minded individuals.",
    icon: <FaUserFriends />,
  },
  {
    name: "Personalized Experience",
    description: "Customize your feed and notifications to your liking.",
    icon: <FaSlidersH />,
  },
];

const platforms = [
  { name: "WhatsApp", desc: "Private group chats", icon: <FaWhatsapp />, color: "bg-green-900 text-green-300" },
  { name: "Discord", desc: "Gaming & social servers", icon: <FaDiscord />, color: "bg-indigo-900 text-indigo-300" },
  { name: "Telegram", desc: "Large-scale communities", icon: <FaTelegram />, color: "bg-sky-900 text-sky-300" },
  { name: "Slack", desc: "Professional networking", icon: <FaSlack />, color: "bg-rose-900 text-rose-300" },
];

const tags = ["UI Design", "UX Research", "Figma", "Product Design"];

export default function DiscoverySection() {
  return (
    <div className="bg-[#141E31] py-20 sm:py-28 px-4">
      <div className="max-w-7xl mx-auto bg-[#181F2A] text-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Left Panel */}
          <div className="p-8 sm:p-12 lg:p-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Find Communities That Match
              <br />
              <span className="text-gray-300">Your Interests</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-xl">
              Our smart discovery algorithm connects you with communities tailored to your passions and professional goals across all platforms.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center" >
                    {React.cloneElement(feature.icon, { size: 20 })}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">{feature.name}</h3>
                    <p className="mt-1 text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-[#232B3B] p-8 sm:p-12 lg:p-16 border-l border-gray-800">
            <h2 className="text-2xl font-bold text-white tracking-tight">All Your Platforms in One Place</h2>
            <p className="mt-3 text-gray-300">Discover communities across all your favorite platforms with our unified search.</p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <div key={platform.name} className={`bg-[#181F2A] p-5 rounded-2xl shadow-sm border border-gray-800 flex items-center space-x-4 ${platform.color}`}>
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${platform.color}`}>
                    {React.cloneElement(platform.icon, { size: 24 })}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{platform.name}</h4>
                    <p className="text-sm text-gray-300">{platform.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-[#181F2A] p-6 rounded-2xl shadow-sm border border-gray-800">
                <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        <FaUsers size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Design Innovators</h3>
                        <p className="text-gray-300">UX/UI Design Community</p>
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 text-sm font-medium bg-gray-800 text-gray-200 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}