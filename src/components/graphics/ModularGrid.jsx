import React, { useRef, useEffect, useState } from 'react';

const ModularGrid = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [params, setParams] = useState({
    modules: 8,
    spacing: 10,
    rotation: 0,
    scale: 1,
    speed: 0.02,
    animationSpeed: 0.02
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

    const drawModule = (x, y, size, rotation, type) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(params.scale, params.scale);
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      
      switch (type) {
        case 0:
          ctx.strokeRect(-size/2, -size/2, size, size);
          break;
        case 1:
          ctx.beginPath();
          ctx.arc(0, 0, size/2, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 2:
          ctx.beginPath();
          ctx.moveTo(0, -size/2);
          ctx.lineTo(-size/2, size/2);
          ctx.lineTo(size/2, size/2);
          ctx.closePath();
          ctx.stroke();
          break;
        case 3:
          ctx.beginPath();
          ctx.moveTo(-size/2, 0);
          ctx.lineTo(size/2, 0);
          ctx.moveTo(0, -size/2);
          ctx.lineTo(0, size/2);
          ctx.stroke();
          break;
      }
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const moduleSize = (Math.min(rect.width, rect.height) / params.modules) - params.spacing;
      const startX = (rect.width - (params.modules * (moduleSize + params.spacing))) / 2 + moduleSize / 2;
      const startY = (rect.height - (params.modules * (moduleSize + params.spacing))) / 2 + moduleSize / 2;

      for (let i = 0; i < params.modules; i++) {
        for (let j = 0; j < params.modules; j++) {
          const x = startX + i * (moduleSize + params.spacing);
          const y = startY + j * (moduleSize + params.spacing);
          
          const distance = Math.sqrt((i - params.modules/2) ** 2 + (j - params.modules/2) ** 2);
          const currentRotation = params.rotation + time + distance * 0.3;
          const type = Math.floor((i + j + Math.floor(time * 2)) % 4);
          const size = moduleSize * (0.8 + 0.2 * Math.sin(time + distance));
          
          drawModule(x, y, size, currentRotation, type);
        }
      }

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < params.modules - 1; i++) {
        for (let j = 0; j < params.modules - 1; j++) {
          const x1 = startX + i * (moduleSize + params.spacing);
          const y1 = startY + j * (moduleSize + params.spacing);
          const x2 = startX + (i + 1) * (moduleSize + params.spacing);
          const y2 = startY + (j + 1) * (moduleSize + params.spacing);
          
          if (Math.sin(time + i + j) > 0) {
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
          modules: <input 
            type="range" 
            min="4" 
            max="12" 
            step="1" 
            value={params.modules}
            onChange={(e) => setParams(p => ({...p, modules: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          spacing: <input 
            type="range" 
            min="2" 
            max="20" 
            step="1" 
            value={params.spacing}
            onChange={(e) => setParams(p => ({...p, spacing: parseInt(e.target.value)}))}
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
            min="0.005" 
            max="0.1" 
            step="0.005" 
            value={params.animationSpeed}
            onChange={(e) => setParams(p => ({...p, animationSpeed: parseFloat(e.target.value)}))}
          />
        </label>
      </div>
    </div>
  );
};

export default ModularGrid;