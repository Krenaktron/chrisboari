import React, { useRef, useEffect, useState } from 'react';

const DataVisualization = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [params, setParams] = useState({
    dataPoints: 50,
    barHeight: 100,
    speed: 0.03,
    smoothing: 0.1,
    showConnections: true,
    animationSpeed: 0.03
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
    let dataValues = Array(params.dataPoints).fill(0).map(() => Math.random());

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const barWidth = rect.width / params.dataPoints;
      const baseY = rect.height * 0.8;

      dataValues = dataValues.map((value, index) => {
        const target = (Math.sin(time + index * 0.2) + 1) * 0.5;
        return value + (target - value) * params.smoothing;
      });

      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      for (let i = 0; i < params.dataPoints; i++) {
        const x = i * barWidth;
        const height = dataValues[i] * params.barHeight;
        const y = baseY - height;
        
        ctx.fillRect(x, y, barWidth - 1, height);
      }

      if (params.showConnections) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < params.dataPoints; i++) {
          const x = i * barWidth + barWidth / 2;
          const y = baseY - dataValues[i] * params.barHeight;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }

      ctx.fillStyle = '#000';
      for (let i = 0; i < params.dataPoints; i++) {
        const x = i * barWidth + barWidth / 2;
        const y = baseY - dataValues[i] * params.barHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i <= 5; i++) {
        const y = baseY - (i / 5) * params.barHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      const avg = dataValues.reduce((a, b) => a + b, 0) / dataValues.length;
      const max = Math.max(...dataValues);
      const min = Math.min(...dataValues);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(`avg: ${avg.toFixed(2)}`, 10, 20);
      ctx.fillText(`max: ${max.toFixed(2)}`, 10, 35);
      ctx.fillText(`min: ${min.toFixed(2)}`, 10, 50);

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
          points: <input 
            type="range" 
            min="20" 
            max="100" 
            step="5" 
            value={params.dataPoints}
            onChange={(e) => setParams(p => ({...p, dataPoints: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          height: <input 
            type="range" 
            min="50" 
            max="200" 
            step="10" 
            value={params.barHeight}
            onChange={(e) => setParams(p => ({...p, barHeight: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          smooth: <input 
            type="range" 
            min="0.01" 
            max="0.3" 
            step="0.01" 
            value={params.smoothing}
            onChange={(e) => setParams(p => ({...p, smoothing: parseFloat(e.target.value)}))}
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

export default DataVisualization;