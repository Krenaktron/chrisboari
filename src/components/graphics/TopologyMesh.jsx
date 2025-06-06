import React, { useRef, useEffect, useState } from 'react';

const TopologyMesh = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [params, setParams] = useState({
    gridSize: 20,
    amplitude: 30,
    frequency: 0.02,
    speed: 0.02,
    connections: true,
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
      
      const points = [];
      const cols = Math.floor(rect.width / params.gridSize);
      const rows = Math.floor(rect.height / params.gridSize);

      for (let i = 0; i <= cols; i++) {
        points[i] = [];
        for (let j = 0; j <= rows; j++) {
          const x = i * params.gridSize;
          const y = j * params.gridSize;
          
          const wave1 = Math.sin((x + time * 50) * params.frequency) * params.amplitude;
          const wave2 = Math.cos((y + time * 30) * params.frequency) * params.amplitude * 0.5;
          
          points[i][j] = {
            x: x + wave1 * 0.3,
            y: y + wave2 * 0.3,
            z: wave1 + wave2
          };
        }
      }

      if (params.connections) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const current = points[i][j];
            
            if (i < cols) { 
              const nextHorizontal = points[i + 1][j];
              ctx.beginPath();
              ctx.moveTo(current.x, current.y);
              ctx.lineTo(nextHorizontal.x, nextHorizontal.y);
              ctx.stroke();
            }
            
            if (j < rows) { 
              const nextVertical = points[i][j + 1];
              ctx.beginPath();
              ctx.moveTo(current.x, current.y);
              ctx.lineTo(nextVertical.x, nextVertical.y);
              ctx.stroke();
            }
          }
        }
      }

      ctx.fillStyle = '#000';
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const point = points[i][j];
          const size = Math.max(0.5, (point.z + params.amplitude) / (params.amplitude * 2) * 3);
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fill();
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
          grid: <input 
            type="range" 
            min="10" 
            max="40" 
            step="2" 
            value={params.gridSize}
            onChange={(e) => setParams(p => ({...p, gridSize: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          amplitude: <input 
            type="range" 
            min="10" 
            max="60" 
            step="5" 
            value={params.amplitude}
            onChange={(e) => setParams(p => ({...p, amplitude: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          frequency: <input 
            type="range" 
            min="0.01" 
            max="0.05" 
            step="0.001" 
            value={params.frequency}
            onChange={(e) => setParams(p => ({...p, frequency: parseFloat(e.target.value)}))}
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

export default TopologyMesh;