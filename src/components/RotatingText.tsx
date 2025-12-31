import React, { useState, useEffect } from 'react';

interface RotatingTextProps {
  words: string[];
  className?: string;
  duration?: number;
}

const RotatingText: React.FC<RotatingTextProps> = ({ 
  words, 
  className = "", 
  duration = 3000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsVisible(true);
      }, 150);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);
  
  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        
        /* Outer container - completely isolated */
        .rotating-text-container {
          display: inline-block;
          position: relative;
          vertical-align: baseline;
          line-height: 1.3;
          isolation: isolate;
          overflow: visible;
          padding-bottom: 0.15em;
        }
        
        /* Glow layer - behind the text */
        .rotating-text-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at center, rgba(0, 200, 255, 0.3) 0%, transparent 70%);
          filter: blur(12px);
          animation: glowPulse 2s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }
        
        /* Text layer - clean gradient text */
        .rotating-gradient-text {
          /* Gradient animation */
          background: linear-gradient(90deg, #00F0FF, #0078FF, #00F0FF);
          background-size: 200% 200%;
          animation: gradientShift 4s ease-in-out infinite;
          
          /* Text clipping for gradient */
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          
          /* Clean display - NO FILTERS */
          display: inline-block;
          position: relative;
          z-index: 1;
          
          /* Remove ALL decorations */
          text-decoration: none;
          border: none;
          outline: none;
          box-shadow: none;
          
          /* Clean spacing - allow descenders */
          padding: 0;
          margin: 0;
          line-height: 1.3;
          vertical-align: baseline;
          overflow: visible;
        }
        
        /* Force clean state on all elements */
        .rotating-text-container,
        .rotating-text-container *,
        .rotating-gradient-text,
        .rotating-gradient-text * {
          text-decoration: none !important;
          text-decoration-line: none !important;
          border-bottom: none !important;
          box-shadow: none !important;
        }
        
        /* Remove all pseudo-elements */
        .rotating-text-container::before,
        .rotating-text-container::after,
        .rotating-gradient-text::before,
        .rotating-gradient-text::after {
          display: none !important;
          content: none !important;
        }
      `}</style>
      <span className="rotating-text-container">
        <span className="rotating-text-glow"></span>
        <span 
          className={`rotating-gradient-text transition-all duration-150 ease-out ${
            isVisible ? 'opacity-100 transform translate-y-0 scale-100' : 'opacity-0 transform translate-y-2 scale-95'
          } ${className}`}
        >
          {words[currentIndex]}.
        </span>
      </span>
    </>
  );
};

export default RotatingText;
