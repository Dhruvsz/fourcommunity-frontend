
import React from "react";

const LogoStrip = () => {
  const logos = [
    { name: "Disney", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png" },
    { name: "KPMG", logo: "https://upload.wikimedia.org/wikipedia/commons/9/94/KPMG_logo.svg" },
    { name: "Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Deloitte.svg" },
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Mercedes", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" },
    { name: "Audi", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg" },
  ];

  return (
    <section className="py-12 bg-secondary/40 overflow-hidden">
      <div className="container text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Trusted by Communities From Companies Like</h3>
        <p className="text-muted-foreground">Join our growing network of quality communities</p>
      </div>
      
      <div className="relative w-full overflow-hidden py-6">
        <div className="animate-marquee flex items-center space-x-16">
          {logos.map((logo, index) => (
            <div key={`${logo.name}-${index}`} className="flex-shrink-0 flex items-center justify-center h-16 w-32">
              <img 
                src={logo.logo} 
                alt={`${logo.name} logo`}
                className="h-10 w-auto mx-auto opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 object-contain"
              />
            </div>
          ))}
          {/* Duplicate logos for seamless looping */}
          {logos.map((logo, index) => (
            <div key={`${logo.name}-duplicate-${index}`} className="flex-shrink-0 flex items-center justify-center h-16 w-32">
              <img 
                src={logo.logo} 
                alt={`${logo.name} logo`}
                className="h-10 w-auto mx-auto opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoStrip;
