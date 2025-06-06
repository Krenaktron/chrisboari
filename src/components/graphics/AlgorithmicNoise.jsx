import React, { useRef, useEffect, useState } from 'react';

const AlgorithmicNoise = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [params, setParams] = useState({
    scale: 0.01,
    octaves: 4,
    persistence: 0.5,
    threshold: 0.3,
    speed: 0.005,
    animationSpeed: 0.005
  });

  const noise = (x, y, z = 0) => {
    const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
  };

  const fbm = (x, y, z, octaves, persistence) => {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    
    for (let i = 0; i < octaves; i++) {
      value += noise(x * frequency, y * frequency, z * frequency) * amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }
    
    return value;
  };

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
      
      const imageData = ctx.createImageData(rect.width, rect.height);
      const data = imageData.data;

      for (let x = 0; x < rect.width; x += 2) {
        for (let y = 0; y < rect.height; y += 2) {
          const noiseValue = fbm(
            x * params.scale,
            y * params.scale,
            time,
            params.octaves,
            params.persistence
          );
          
          if (noiseValue > params.threshold) {
            const index = (y * rect.width + x) * 4;
            const intensity = Math.floor((noiseValue + 1) * 127);
            
            data[index] = 0;
            data[index + 1] = 0;
            data[index + 2] = 0;
            data[index + 3] = intensity;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x < rect.width; x += 20) {
        for (let y = 0; y < rect.height; y += 20) {
          const angle = fbm(x * params.scale * 2, y * params.scale * 2, time * 2, 2, 0.5) * Math.PI;
          const length = 10;
          
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(angle) * length,
            y + Math.sin(angle) * length
          );
          ctx.stroke();
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
          scale: <input 
            type="range" 
            min="0.005" 
            max="0.05" 
            step="0.001" 
            value={params.scale}
            onChange={(e) => setParams(p => ({...p, scale: parseFloat(e.target.value)}))}
          />
        </label>
        <label>
          octaves: <input 
            type="range" 
            min="1" 
            max="8" 
            step="1" 
            value={params.octaves}
            onChange={(e) => setParams(p => ({...p, octaves: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          threshold: <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={params.threshold}
            onChange={(e) => setParams(p => ({...p, threshold: parseFloat(e.target.value)}))}
          />
        </label>
        <label>
          anim. speed: <input 
            type="range" 
            min="0.001" 
            max="0.02" 
            step="0.001" 
            value={params.animationSpeed}
            onChange={(e) => setParams(p => ({...p, animationSpeed: parseFloat(e.target.value)}))}
          />
        </label>
      </div>
    </div>
  );
};

export default AlgorithmicNoise;