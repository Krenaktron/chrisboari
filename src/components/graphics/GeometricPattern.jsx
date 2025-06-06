import React, { useRef, useEffect, useState } from 'react';

const GeometricPattern = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [params, setParams] = useState({
    sides: 6,
    layers: 8,
    rotation: 0,
    scale: 1,
    speed: 0.01,
    animationSpeed: 0.01
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let time = 0;

    const drawPolygon = (centerX, centerY, radius, sides, rotation) => {
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + rotation;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const maxRadius = Math.min(rect.width, rect.height) * 0.4;

      for (let layer = 0; layer < params.layers; layer++) {
        const radius = (maxRadius / params.layers) * (layer + 1) * params.scale;
        const currentRotation = params.rotation + time + (layer * Math.PI / params.layers);
        const opacity = 1 - (layer / params.layers) * 0.7;
        
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.lineWidth = 1;
        
        drawPolygon(centerX, centerY, radius, params.sides, currentRotation);
        
        if (layer > 0) {
          const prevRadius = (maxRadius / params.layers) * layer * params.scale;
          ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.3})`;
          
          for (let i = 0; i < params.sides; i++) {
            const angle = (i / params.sides) * Math.PI * 2 + currentRotation;
            const x1 = centerX + Math.cos(angle) * prevRadius;
            const y1 = centerY + Math.sin(angle) * prevRadius;
            const x2 = centerX + Math.cos(angle) * radius;
            const y2 = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      time += params.animationSpeed;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [params]);

  return (
    <div className="canvas-container w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      <div className="control-panel">
        <label>
          sides: <input 
            type="range" 
            min="3" 
            max="12" 
            step="1" 
            value={params.sides}
            onChange={(e) => setParams(p => ({...p, sides: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          layers: <input 
            type="range" 
            min="3" 
            max="15" 
            step="1" 
            value={params.layers}
            onChange={(e) => setParams(p => ({...p, layers: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          scale: <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={params.scale}
            onChange={(e) => setParams(p => ({...p, scale: parseFloat(e.target.value)}))}
          />
        </label>
        <label>
          anim. speed: <input 
            type="range" 
            min="0.001" 
            max="0.05" 
            step="0.001" 
            value={params.animationSpeed}
            onChange={(e) => setParams(p => ({...p, animationSpeed: parseFloat(e.target.value)}))}
          />
        </label>
      </div>
    </div>
  );
};

export default GeometricPattern;