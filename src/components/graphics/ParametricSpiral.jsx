import React, { useRef, useEffect, useState } from 'react';

const ParametricSpiral = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [params, setParams] = useState({
    a: 2,
    b: 0.5,
    speed: 0.02,
    density: 300,
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

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 0.5;
      ctx.beginPath();

      for (let i = 0; i < params.density; i++) {
        const t = (i / params.density) * Math.PI * 6 + time;
        const r = params.a + params.b * t;
        const x = centerX + r * Math.cos(t) * 3;
        const y = centerY + r * Math.sin(t) * 3;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      ctx.fillStyle = '#000';
      for (let i = 0; i < params.density; i += 10) {
        const t = (i / params.density) * Math.PI * 6 + time;
        const r = params.a + params.b * t;
        const x = centerX + r * Math.cos(t) * 3;
        const y = centerY + r * Math.sin(t) * 3;
        
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
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
          a: <input 
            type="range" 
            min="0.5" 
            max="5" 
            step="0.1" 
            value={params.a}
            onChange={(e) => setParams(p => ({...p, a: parseFloat(e.target.value)}))}
          />
        </label>
        <label>
          b: <input 
            type="range" 
            min="0.1" 
            max="2" 
            step="0.1" 
            value={params.b}
            onChange={(e) => setParams(p => ({...p, b: parseFloat(e.target.value)}))}
          />
        </label>
        <label>
          density: <input 
            type="range" 
            min="100" 
            max="500" 
            step="10" 
            value={params.density}
            onChange={(e) => setParams(p => ({...p, density: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          anim. speed: <input 
            type="range" 
            min="0.001" 
            max="0.1" 
            step="0.001" 
            value={params.animationSpeed}
            onChange={(e) => setParams(p => ({...p, animationSpeed: parseFloat(e.target.value)}))}
          />
        </label>
      </div>
    </div>
  );
};

export default ParametricSpiral;