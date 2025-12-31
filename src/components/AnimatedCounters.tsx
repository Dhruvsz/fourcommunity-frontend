
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMouseGradient } from "@/hooks/use-mouse-gradient";

interface CounterProps {
  target: number;
  label: string;
  suffix?: string;
  duration?: number;
}

const Counter = ({ target, label, suffix = "", duration = 2 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }
    
    return () => {
      if (nodeRef.current) {
        observer.unobserve(nodeRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * target);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [target, duration, isInView]);
  
  return (
    <div ref={nodeRef} className="flex flex-col items-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count}{suffix}
      </div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
};

const AnimatedCounters = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useMouseGradient(sectionRef, {
    intensity: 0.05,
    color: "rgba(59,130,246,0.08)",
    radius: 350,
  });

  return (
    <section ref={sectionRef} className="py-16 bg-black relative overflow-hidden">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <Counter target={12340} label="Members" suffix="+" />
          <Counter target={1200} label="Groups" suffix="+" />
          <Counter target={92} label="Cities" />
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedCounters;
