import { useRef } from "react";
import { motion } from "framer-motion";

const companies = [
  { name: "Meta", logo: "/logos/meta.svg" },
  { name: "Google", logo: "/logos/google.svg" },
  { name: "Microsoft", logo: "/logos/microsoft.svg" },
  { name: "Apple", logo: "/logos/apple.svg" },
  { name: "Amazon", logo: "/logos/amazon.svg" },
  { name: "OpenAI", logo: "/logos/openai.svg" },
  { name: "KPMG", logo: "/logos/kpmg.svg" },
  { name: "PwC", logo: "/logos/pwc.svg" },
  { name: "Oracle", logo: "/logos/oracle.svg" },
];

export default function TrustedCompanies() {
  // Double the logos for seamless infinite scroll
  const logos = [...companies, ...companies];
  const marqueeRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900/30 to-black/20 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-tight">
            Trusted by People from Companies Like
          </h2>
          <p className="text-base text-gray-400 max-w-2xl mx-auto font-light">
            Community members from leading technology companies around the world
          </p>
        </motion.div>
        
        {/* Logo carousel container */}
        <div className="relative overflow-hidden w-full py-8">
          {/* Subtle gradient fade edges */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-[#141E31] via-[#141E31]/80 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-[#141E31] via-[#141E31]/80 to-transparent z-10"></div>
          
          <div
            ref={marqueeRef}
            className="flex items-center gap-16 lg:gap-20 animate-marquee-professional"
            style={{ minWidth: '200%' }}
          >
            {logos.map((company, idx) => (
              <div
                key={company.name + idx}
                className="flex items-center justify-center min-w-[160px] lg:min-w-[200px] h-16 lg:h-20 group"
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-8 lg:h-10 w-auto object-contain filter brightness-0 invert opacity-40 group-hover:opacity-70 transition-opacity duration-500 ease-out"
                  draggable={false}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
        
        <style>{`
          @keyframes marquee-professional {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-professional {
            animation: marquee-professional 40s linear infinite;
          }
          .animate-marquee-professional:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
}
