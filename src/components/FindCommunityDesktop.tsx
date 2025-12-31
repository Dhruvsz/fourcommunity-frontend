import React from "react";
import { FaMobileAlt, FaFolderOpen, FaWhatsapp, FaTelegram, FaDiscord, FaRocket, FaMicrochip, FaPaintBrush, FaChartLine } from "react-icons/fa";

const platforms = [
  {
    icon: <FaWhatsapp />, name: "WhatsApp", desc: "Real-time messaging with end-to-end encryption for secure communication", stats: "24K+ active communities", color: "bg-[#25D366] whatsapp"
  },
  {
    icon: <FaTelegram />, name: "Telegram", desc: "Powerful features for large communities with unlimited members", stats: "32K+ thriving communities", color: "bg-[#0088cc] telegram"
  },
  {
    icon: <FaDiscord />, name: "Discord", desc: "Voice, video, and text communication for gamers and creators", stats: "18K+ specialized servers", color: "bg-[#5865F2] discord"
  },
];

const categories = [
  {
    icon: <FaRocket />, name: "Startups", desc: "Connect with founders, investors, and innovation enthusiasts", stats: "24.5K+ ambitious members", color: "bg-[#3b82f6] startups"
  },
  {
    icon: <FaMicrochip />, name: "Tech", desc: "Discuss emerging technologies, programming, and innovation", stats: "68.2K+ tech enthusiasts", color: "bg-[#8b5cf6] tech"
  },
  {
    icon: <FaPaintBrush />, name: "Creators", desc: "For artists, designers, and digital content creators", stats: "42.3K+ creative contributors", color: "bg-[#ec4899] creators"
  },
  {
    icon: <FaChartLine />, name: "Finance", desc: "Investment strategies, market analysis, and wealth building", stats: "35.7K+ finance experts", color: "bg-[#fbbf24] finance"
  },
];

export default function FindCommunityDesktop() {
  return (
    <div className="relative flex justify-center items-center w-full min-h-[85vh] py-8 px-2 bg-[#0f172a] overflow-x-hidden">
      {/* Decorative Circles & Dots */}
      <div className="absolute z-0 top-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full" style={{background: "radial-gradient(circle, rgba(37,99,235,0.1), transparent 70%)"}} />
      <div className="absolute z-0 bottom-[-200px] left-[-200px] w-[400px] h-[400px] rounded-full" style={{background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)"}} />
      <div className="absolute z-0 inset-0 w-full h-full" style={{backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.05}} />
      <div className="container w-full max-w-[1400px] bg-[#1e293b] rounded-[24px] overflow-hidden shadow-2xl border border-[#334155] relative z-10">
        <header className="text-center py-20 px-10 bg-gradient-to-b from-[#0f172a] to-[#1e293b] border-b border-[#334155]">
          <h1 className="text-[3.8rem] font-extrabold mb-5 text-white tracking-tight leading-tight" style={{letterSpacing: "-0.5px", textShadow: "0 4px 15px rgba(0,0,0,0.15)"}}>Find Your Community</h1>
          <p className="subtitle text-[1.4rem] font-normal max-w-[700px] mx-auto leading-relaxed text-[#cbd5e1]">Connect with like-minded individuals in specialized communities tailored to your interests and professional needs</p>
        </header>
        <div className="content flex gap-10 px-10 py-10">
          {/* Platform Section */}
          <div className="section flex-1 p-10 bg-[#1e293b] rounded-[20px] border border-[#334155] shadow-md transition-all duration-300">
            <div className="section-title flex items-center gap-5 mb-10 pb-6 border-b-2 border-[#1e40af]">
              <span className="flex items-center justify-center w-[70px] h-[70px] rounded-[18px] bg-[rgba(30,64,175,0.1)] border border-[#1e40af] text-[2.2rem] text-[#60a5fa]"><FaMobileAlt /></span>
              <h2 className="text-2xl font-bold text-[#f0f9ff]">Choose Platform</h2>
            </div>
            <div className="cards-grid grid grid-cols-2 gap-[30px]">
              {platforms.map((p, i) => (
                <div key={p.name} className="card bg-[#1f2937] rounded-[18px] p-[30px] border border-[#374151] cursor-pointer relative overflow-hidden transition-all duration-300 animate-fadeInUp" style={{animationDelay: `${0.1 + i * 0.1}s`}}>
                  <div className="card-header flex items-center gap-5 mb-6">
                    <div className={`card-icon w-[60px] h-[60px] rounded-[16px] flex items-center justify-center text-white text-[1.8rem] shadow-lg ${p.color}`}>{p.icon}</div>
                    <h3 className="text-[1.6rem] font-bold text-[#f0f9ff] tracking-tight">{p.name}</h3>
                  </div>
                  <p className="text-[#cbd5e1] mb-6 leading-relaxed text-[1.1rem] pl-2">{p.desc}</p>
                  <div className="stats bg-[rgba(30,64,175,0.2)] px-5 py-2 rounded-[30px] inline-block text-[1rem] font-semibold ml-2 text-[#93c5fd] border border-[rgba(59,130,246,0.3)] transition-all duration-300">{p.stats}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Category Section */}
          <div className="section flex-1 p-10 bg-[#1e293b] rounded-[20px] border border-[#334155] shadow-md transition-all duration-300">
            <div className="section-title flex items-center gap-5 mb-10 pb-6 border-b-2 border-[#1e40af]">
              <span className="flex items-center justify-center w-[70px] h-[70px] rounded-[18px] bg-[rgba(30,64,175,0.1)] border border-[#1e40af] text-[2.2rem] text-[#60a5fa]"><FaFolderOpen /></span>
              <h2 className="text-2xl font-bold text-[#f0f9ff]">Choose Category</h2>
            </div>
            <div className="cards-grid grid grid-cols-2 gap-[30px]">
              {categories.map((c, i) => (
                <div key={c.name} className="card bg-[#1f2937] rounded-[18px] p-[30px] border border-[#374151] cursor-pointer relative overflow-hidden transition-all duration-300 animate-fadeInUp" style={{animationDelay: `${0.3 + i * 0.1}s`}}>
                  <div className="card-header flex items-center gap-5 mb-6">
                    <div className={`card-icon w-[60px] h-[60px] rounded-[16px] flex items-center justify-center text-white text-[1.8rem] shadow-lg ${c.color}`}>{c.icon}</div>
                    <h3 className="text-[1.6rem] font-bold text-[#f0f9ff] tracking-tight">{c.name}</h3>
                  </div>
                  <p className="text-[#cbd5e1] mb-6 leading-relaxed text-[1.1rem] pl-2">{c.desc}</p>
                  <div className="stats bg-[rgba(30,64,175,0.2)] px-5 py-2 rounded-[30px] inline-block text-[1rem] font-semibold ml-2 text-[#93c5fd] border border-[rgba(59,130,246,0.3)] transition-all duration-300">{c.stats}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <footer className="text-center py-10 px-10 text-[#9ca3af] text-[1.1rem] border-t border-[#334155] bg-[#1e293b]">
          <p className="mb-4">Discover your perfect community today. Join thousands of like-minded individuals.</p>
          <a href="#" className="cta-button inline-block mt-2 px-10 py-4 bg-[#2563eb] text-white font-semibold rounded-[30px] text-[1.2rem] transition-all duration-300 shadow-lg border-2 border-[#3b82f6] hover:-translate-y-1 hover:bg-[#1d4ed8]">Get Started Now</a>
        </footer>
      </div>
      {/* Animations for fadeInUp */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease forwards; opacity: 0; }
      `}</style>
    </div>
  );
} 