import React, { useRef, useEffect, useState } from 'react';

const ComputationalField = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [params, setParams] = useState({
    resolution: 15,
    fieldStrength: 2,
    particleCount: 100,
    speed: 0.02,
    decay: 0.98,
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
    let particles = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < params.particleCount; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: 0,
          vy: 0,
          life: 1,
          trail: []
        });
      }
    };

    initParticles();

    const getFieldForce = (x, y, time) => {
      const fx = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time * 0.7);
      const fy = Math.cos(x * 0.01 + time * 0.5) * Math.sin(y * 0.01 + time);
      return { fx: fx * params.fieldStrength, fy: fy * params.fieldStrength };
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, rect.width, rect.height);
      
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x < rect.width; x += params.resolution) {
        for (let y = 0; y < rect.height; y += params.resolution) {
          const force = getFieldForce(x, y, time);
          const length = Math.sqrt(force.fx * force.fx + force.fy * force.fy) * 10;
          
          if (length > 1) {
            const angle = Math.atan2(force.fy, force.fx);
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - Math.cos(angle - 0.3) * 3,
              endY - Math.sin(angle - 0.3) * 3
            );
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - Math.cos(angle + 0.3) * 3,
              endY - Math.sin(angle + 0.3) * 3
            );
            ctx.stroke();
          }
        }
      }
      
      particles.forEach(particle => {
        const force = getFieldForce(particle.x, particle.y, time);
        
        particle.vx += force.fx * 0.1;
        particle.vy += force.fy * 0.1;
        
        particle.vx *= params.decay;
        particle.vy *= params.decay;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;
        
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 20) {
          particle.trail.shift();
        }
        
        particle.life *= 0.999;
        if (particle.life < 0.1) {
          particle.x = Math.random() * rect.width;
          particle.y = Math.random() * rect.height;
          particle.vx = 0;
          particle.vy = 0;
          particle.life = 1;
          particle.trail = [];
        }
      });
      
      particles.forEach(particle => {
        if (particle.trail.length > 1) {
          ctx.strokeStyle = `rgba(0, 0, 0, ${particle.life * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          
          particle.trail.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          
          ctx.stroke();
        }
      });
      
      ctx.fillStyle = '#000';
      particles.forEach(particle => {
        ctx.globalAlpha = particle.life;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;

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
          resolution: <input 
            type="range" 
            min="10" 
            max="30" 
            step="2" 
            value={params.resolution}
            onChange={(e) => setParams(p => ({...p, resolution: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          strength: <input 
            type="range" 
            min="0.5" 
            max="5" 
            step="0.1" 
            value={params.fieldStrength}
            onChange={(e) => setParams(p => ({...p, fieldStrength: parseFloat(e.target.value)}))}
          />
        </label>
        <label>
          particles: <input 
            type="range" 
            min="50" 
            max="200" 
            step="10" 
            value={params.particleCount}
            onChange={(e) => setParams(p => ({...p, particleCount: parseInt(e.target.value)}))}
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

export default ComputationalField;