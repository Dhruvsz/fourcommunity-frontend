
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Sample community data for globe pins
const globalCommunities = [
  { lat: 37.7749, lng: -122.4194, name: "Tech Innovators" }, // San Francisco
  { lat: 40.7128, lng: -74.0060, name: "NYC Startups" }, // New York
  { lat: 51.5074, lng: -0.1278, name: "London Digital" }, // London
  { lat: 35.6762, lng: 139.6503, name: "Tokyo Creators" }, // Tokyo
  { lat: 28.6139, lng: 77.2090, name: "Delhi Developers" }, // Delhi
  { lat: -33.8688, lng: 151.2093, name: "Sydney Network" }, // Sydney
  { lat: -23.5558, lng: -46.6396, name: "São Paulo Hub" }, // São Paulo
  { lat: 55.7558, lng: 37.6173, name: "Moscow Tech" }, // Moscow
  { lat: 30.0444, lng: 31.2357, name: "Cairo Connect" }, // Cairo
  { lat: 19.0760, lng: 72.8777, name: "Mumbai Circle" }, // Mumbai
  { lat: 25.2048, lng: 55.2708, name: "Dubai Network" }, // Dubai
  { lat: 1.3521, lng: 103.8198, name: "Singapore Tech" }, // Singapore
];

const RotatingGlobe = () => {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create globe visualization
    const createGlobe = async () => {
      try {
        // We'll use a simpler approach without Three.js for now
        // This is a placeholder that simulates a rotating globe effect
        if (!globeRef.current) return;
        
        const globeElement = globeRef.current;
        let rotation = 0;
        
        const dots: HTMLDivElement[] = [];
        // Create dots representing locations
        for (let i = 0; i < 100; i++) {
          const dot = document.createElement('div');
          dot.className = 'absolute rounded-full bg-primary/60 backdrop-blur-sm';
          
          // Random position on "globe"
          const theta = Math.random() * Math.PI * 2; // Horizontal angle
          const phi = Math.random() * Math.PI; // Vertical angle
          
          // Convert spherical to cartesian coordinates
          const radius = 140;
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.sin(phi) * Math.sin(theta);
          const z = radius * Math.cos(phi);
          
          // Set size based on z position (depth)
          const size = 2 + (z + radius) / (radius * 2) * 4;
          
          dot.style.width = `${size}px`;
          dot.style.height = `${size}px`;
          dot.style.left = `${150 + x}px`;
          dot.style.top = `${150 + y}px`;
          dot.style.opacity = `${0.2 + (z + radius) / (radius * 2) * 0.8}`;
          
          // Add pulse animation for some dots
          if (Math.random() > 0.9) {
            dot.classList.add('animate-pulse-blue');
          }
          
          dots.push(dot);
          globeElement.appendChild(dot);
        }
        
        // Add community pins
        globalCommunities.forEach((community, i) => {
          const { lat, lng, name } = community;
          
          // Convert lat/lng to 3D coordinates
          const phi = (90 - lat) * (Math.PI / 180); // Latitude to phi in radians
          const theta = (lng + 180) * (Math.PI / 180); // Longitude to theta in radians
          
          const radius = 140;
          const x = -radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          
          // Create pin element
          const pin = document.createElement('div');
          
          // Calculate visible position (based on z)
          const isVisible = z > -20;
          
          // Calculate size and opacity based on z position
          const scale = Math.max(0.5, (z + radius) / (radius * 2) * 2);
          const opacity = Math.max(0.2, (z + radius) / (radius * 2) * 1);
          
          if (isVisible) {
            pin.className = 'absolute flex flex-col items-center pointer-events-none';
            
            // Pin marker
            const marker = document.createElement('div');
            marker.className = 'w-2 h-2 bg-blue-500 rounded-full mb-1 animate-pulse';
            pin.appendChild(marker);
            
            // Label
            if (z > 50) {
              const label = document.createElement('div');
              label.className = 'text-[8px] text-blue-400 whitespace-nowrap font-medium';
              label.textContent = name;
              pin.appendChild(label);
            }
            
            pin.style.transform = `scale(${scale})`;
            pin.style.opacity = `${opacity}`;
            pin.style.left = `${150 + x}px`;
            pin.style.top = `${150 + y}px`;
            pin.style.zIndex = `${Math.floor((z + 140) * 10)}`;
            
            globeElement.appendChild(pin);
            dots.push(pin as HTMLDivElement);
          }
        });
        
        // Rotation animation
        const animate = () => {
          rotation += 0.002;
          dots.forEach((dot, i) => {
            const theta = (i / dots.length) * Math.PI * 2 + rotation;
            const phi = Math.acos(2 * (i % 20) / 20 - 1);
            
            const radius = 140;
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            const size = 2 + (z + radius) / (radius * 2) * 4;
            
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.left = `${150 + x}px`;
            dot.style.top = `${150 + y}px`;
            dot.style.opacity = `${0.2 + (z + radius) / (radius * 2) * 0.8}`;
          });
          
          requestAnimationFrame(animate);
        };
        
        animate();
      } catch (error) {
        console.error("Failed to create globe:", error);
      }
    };
    
    createGlobe();
  }, []);

  return (
    <motion.div 
      className="relative h-[300px] w-[300px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Globe container */}
      <div 
        ref={globeRef} 
        className="relative h-full w-full"
      >
        {/* Center glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-primary/5 filter blur-xl"></div>
        
        {/* Globe circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-primary/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] border border-primary/10 rounded-full"></div>
      </div>
      
      {/* Animated overlay pulse */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-primary/30"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.2, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default RotatingGlobe;
