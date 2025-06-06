import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedLogo = ({ src, className }) => {
  const [svgContent, setSvgContent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const svgContainerRef = useRef(null);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        if (svgElement.tagName.toLowerCase() !== 'svg') {
            throw new Error("Fetched content is not a valid SVG element.");
        }
        
        const paths = Array.from(svgElement.querySelectorAll('path, circle, rect, line, polyline, polygon'));
        
        paths.forEach(path => {
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke', 'currentColor');
          path.setAttribute('stroke-width', path.getAttribute('stroke-width') || '1'); 
        });
        
        setSvgContent(svgElement.outerHTML);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch or parse SVG:", error);
        setSvgContent(null); 
        setIsLoaded(false);
      }
    };
    fetchSvg();
  }, [src]);

  if (!isLoaded) {
    return <div className={`w-8 h-8 ${className}`}>Loading Logo...</div>; 
  }
  
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.1, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay: i * 0.1, duration: 0.01 }
      }
    })
  };

  return (
    <motion.div
      ref={svgContainerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity:0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.2 
            } 
        }
      }}
      style={{ display: 'inline-block', color: 'currentColor' }} 
    >
    </motion.div>
  );
};

export default AnimatedLogo;