'use client';

import React, { useEffect, useState } from "react";

interface ScrollButtonProps {
  targetId: string;
}

export default function ScrollButton({ targetId }: ScrollButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const targetPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = targetPosition + window.pageYOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-10"
      aria-label={`Scroll to ${targetId}`}
    >
      <div 
        className={`p-3 rounded-full transition-all duration-300 ${
          isHovered ? 'bg-white/30 scale-110' : ''
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-colors duration-300 ${
            isHovered ? 'text-indigo-200' : 'text-white'
          }`}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </button>
  );
}
