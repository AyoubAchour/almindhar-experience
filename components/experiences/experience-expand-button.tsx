'use client';

import { useEffect, useRef, useState } from 'react';

export function ExperienceExpandButton() {
  const [expandedStates, setExpandedStates] = useState<Record<number, boolean>>({});
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Check for overflow on each container
    containerRefs.current.forEach((container, index) => {
      if (container) {
        const paragraph = container.querySelector('p');
        const expandBtn = container.querySelector('.expandBtn') as HTMLButtonElement;
        
        if (paragraph && expandBtn && paragraph.scrollHeight > container.clientHeight) {
          expandBtn.classList.remove('hidden');
        }
      }
    });
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return null; // This component just adds the functionality
}

export function ExpandableDescription({ 
  description, 
  index 
}: { 
  description: string; 
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const paragraph = containerRef.current.querySelector('p');
      if (paragraph && paragraph.scrollHeight > containerRef.current.clientHeight) {
        setShowButton(true);
      }
    }
  }, [description]);

  return (
    <div 
      ref={containerRef}
      className={`mb-4 overflow-hidden ${isExpanded ? 'h-auto' : 'h-12'}`}
    >
      <p className="text-gray-600 text-sm">{description}</p>
      {showButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`expandBtn text-primary text-sm font-medium hover:underline ${
            isExpanded ? 'mt-1' : ''
          }`}
        >
          {isExpanded ? 'Voir moins' : 'Voir plus...'}
        </button>
      )}
    </div>
  );
}