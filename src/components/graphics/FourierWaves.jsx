import React, { useRef, useEffect, useState } from 'react';

const FourierWaves = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [params, setParams] = useState({
    frequency1: 1,
    frequency2: 2,
    amplitude1: 50,
    amplitude2: 30,
    phase: 0,
    speed: 0.05,
    animationSpeed: 0.05
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
      
      const centerY = rect.height / 2;
      
      for (let layer = 0; layer < 3; layer++) {
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.8 - layer * 0.2})`;
        ctx.lineWidth = 2 - layer * 0.5;
        ctx.beginPath();

        for (let x = 0; x < rect.width; x += 2) {
          const t = (x / rect.width) * Math.PI * 4;
          const wave1 = Math.sin(t * params.frequency1 + time + layer) * params.amplitude1;
          const wave2 = Math.sin(t * params.frequency2 + time * 1.5 + layer) * params.amplitude2;
          const wave3 = Math.sin(t * 3 + time * 0.5 + layer) * 20;
          
          const y = centerY + wave1 + wave2 + wave3 + layer * 10;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let x = 0; x < rect.width; x += 8) {
        for (let y = 0; y < rect.height; y += 8) {
          const t1 = (x / rect.width) * Math.PI * 2;
          const t2 = (y / rect.height) * Math.PI * 2;
          const interference = Math.sin(t1 * params.frequency1 + time) * Math.sin(t2 * params.frequency2 + time);
          
          if (interference > 0.5) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
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
          freq1: <input 
            type="range" 
            min="0.5" 
            max="5" 
            step="0.1" 
            value={params.frequency1}
            onChange={(e) => setParams(p => ({...p, frequency1: parseFloat(e.target.value)}))}
          />
        </label>
        <label>
          freq2: <input 
            type="range" 
            min="0.5" 
            max="5" 
            step="0.1" 
            value={params.frequency2}
            onChange={(e) => setParams(p => ({...p, frequency2: parseFloat(e.target.value)}))}
          />
        </label>
        <label>
          amp1: <input 
            type="range" 
            min="10" 
            max="100" 
            step="5" 
            value={params.amplitude1}
            onChange={(e) => setParams(p => ({...p, amplitude1: parseFloat(e.target.value)}))}
          />
        </label>
        <label>
          anim. speed: <input 
            type="range" 
            min="0.01" 
            max="0.2" 
            step="0.01" 
            value={params.animationSpeed}
            onChange={(e) => setParams(p => ({...p, animationSpeed: parseFloat(e.target.value)}))}
          />
        </label>
      </div>
    </div>
  );
};

export default FourierWaves;