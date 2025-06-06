import React, { useRef, useEffect, useState } from 'react';

const SymmetryPattern = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [params, setParams] = useState({
    symmetry: 8,
    radius: 80,
    complexity: 3,
    speed: 0.01,
    mirror: true,
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

    const drawSymmetricPattern = (centerX, centerY, currentRadius, currentComplexity, currentTime) => {
      const angleStep = (Math.PI * 2) / params.symmetry;
      
      for (let i = 0; i < params.symmetry; i++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(i * angleStep);
        
        if (params.mirror && i % 2 === 1) {
          ctx.scale(-1, 1);
        }
        
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.8 - (i / params.symmetry) * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let j = 0; j < currentComplexity; j++) {
          const r = (currentRadius / currentComplexity) * (j + 1);
          const angle = currentTime + j * 0.5;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          
          if (j === 0) {
            ctx.moveTo(0, 0);
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.stroke();
        ctx.restore();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      drawSymmetricPattern(centerX, centerY, params.radius, params.complexity, time);
      
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + time * 0.5;
        const distance = params.radius * 1.5;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.scale(0.5, 0.5);
        drawSymmetricPattern(x * 2, y * 2, params.radius, params.complexity, time * 0.8 + i);
        ctx.restore();
      }
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.stroke();

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
          symmetry: <input 
            type="range" 
            min="3" 
            max="16" 
            step="1" 
            value={params.symmetry}
            onChange={(e) => setParams(p => ({...p, symmetry: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          radius: <input 
            type="range" 
            min="40" 
            max="120" 
            step="5" 
            value={params.radius}
            onChange={(e) => setParams(p => ({...p, radius: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          complexity: <input 
            type="range" 
            min="2" 
            max="8" 
            step="1" 
            value={params.complexity}
            onChange={(e) => setParams(p => ({...p, complexity: parseInt(e.target.value)}))}
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

export default SymmetryPattern;