import React from 'react';

interface SlackIconProps {
  className?: string;
}

const SlackIcon: React.FC<SlackIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top left - Cyan */}
      <path 
        d="M6 14.5C6 15.328 5.328 16 4.5 16C3.672 16 3 15.328 3 14.5C3 13.672 3.672 13 4.5 13H6V14.5Z" 
        fill="#36C5F0"
      />
      <path 
        d="M7 14.5C7 13.672 7.672 13 8.5 13C9.328 13 10 13.672 10 14.5V19.5C10 20.328 9.328 21 8.5 21C7.672 21 7 20.328 7 19.5V14.5Z" 
        fill="#36C5F0"
      />
      
      {/* Top right - Green */}
      <path 
        d="M8.5 6C7.672 6 7 5.328 7 4.5C7 3.672 7.672 3 8.5 3C9.328 3 10 3.672 10 4.5V6H8.5Z" 
        fill="#2EB67D"
      />
      <path 
        d="M8.5 7C9.328 7 10 7.672 10 8.5C10 9.328 9.328 10 8.5 10H3.5C2.672 10 2 9.328 2 8.5C2 7.672 2.672 7 3.5 7H8.5Z" 
        fill="#2EB67D"
      />
      
      {/* Bottom left - Red/Pink */}
      <path 
        d="M18 8.5C18 7.672 18.672 7 19.5 7C20.328 7 21 7.672 21 8.5C21 9.328 20.328 10 19.5 10H18V8.5Z" 
        fill="#E01E5A"
      />
      <path 
        d="M17 8.5C17 9.328 16.328 10 15.5 10C14.672 10 14 9.328 14 8.5V3.5C14 2.672 14.672 2 15.5 2C16.328 2 17 2.672 17 3.5V8.5Z" 
        fill="#E01E5A"
      />
      
      {/* Bottom right - Yellow */}
      <path 
        d="M15.5 18C16.328 18 17 18.672 17 19.5C17 20.328 16.328 21 15.5 21C14.672 21 14 20.328 14 19.5V18H15.5Z" 
        fill="#ECB22E"
      />
      <path 
        d="M15.5 17C14.672 17 14 16.328 14 15.5C14 14.672 14.672 14 15.5 14H20.5C21.328 14 22 14.672 22 15.5C22 16.328 21.328 17 20.5 17H15.5Z" 
        fill="#ECB22E"
      />
    </svg>
  );
};

export default SlackIcon;
