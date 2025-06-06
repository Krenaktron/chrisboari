import React, { useRef, useEffect, useState } from 'react';

const GenerativeForm = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [params, setParams] = useState({
    iterations: 500,
    growth: 0.02,
    branching: 0.1,
    attraction: 0.05,
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
    let agents = [];

    const initAgents = () => {
      agents = [];
      for (let i = 0; i < 5; i++) {
        agents.push({
          x: rect.width / 2 + (Math.random() - 0.5) * 100,
          y: rect.height / 2 + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          trail: [],
          age: 0
        });
      }
    };

    initAgents();

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, rect.width, rect.height);
      
      agents.forEach((agent, index) => {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const dx = centerX - agent.x;
        const dy = centerY - agent.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        agent.vx += (dx / distance) * params.attraction;
        agent.vy += (dy / distance) * params.attraction;
        
        agent.vx += (Math.random() - 0.5) * 0.1;
        agent.vy += (Math.random() - 0.5) * 0.1;
        
        agents.forEach((other, otherIndex) => {
          if (index !== otherIndex) {
            const odx = other.x - agent.x;
            const ody = other.y - agent.y;
            const odist = Math.sqrt(odx * odx + ody * ody);
            
            if (odist < 50 && odist > 0) {
              agent.vx -= (odx / odist) * 0.02;
              agent.vy -= (ody / odist) * 0.02;
            }
          }
        });
        
        agent.vx *= 0.99;
        agent.vy *= 0.99;
        
        agent.x += agent.vx;
        agent.y += agent.vy;
        
        if (agent.x < 0 || agent.x > rect.width) agent.vx *= -1;
        if (agent.y < 0 || agent.y > rect.height) agent.vy *= -1;
        
        agent.x = Math.max(0, Math.min(rect.width, agent.x));
        agent.y = Math.max(0, Math.min(rect.height, agent.y));
        
        agent.trail.push({ x: agent.x, y: agent.y });
        if (agent.trail.length > params.iterations) {
          agent.trail.shift();
        }
        
        agent.age++;
      });
      
      agents.forEach((agent, agentIndex) => {
        if (agent.trail.length > 1) {
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.8 - agentIndex * 0.1})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          
          agent.trail.forEach((point, index) => {
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
      agents.forEach(agent => {
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < agents.length; i++) {
        for (let j = i + 1; j < agents.length; j++) {
          const dx = agents[j].x - agents[i].x;
          const dy = agents[j].y - agents[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(agents[i].x, agents[i].y);
            ctx.lineTo(agents[j].x, agents[j].y);
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
          trail: <input 
            type="range" 
            min="100" 
            max="1000" 
            step="50" 
            value={params.iterations}
            onChange={(e) => setParams(p => ({...p, iterations: parseInt(e.target.value)}))}
          />
        </label>
        <label>
          growth: <input 
            type="range" 
            min="0.01" 
            max="0.1" 
            step="0.01" 
            value={params.growth}
            onChange={(e) => setParams(p => ({...p, growth: parseFloat(e.target.value)}))}
          />
        </label>
        <label>
          attraction: <input 
            type="range" 
            min="0.01" 
            max="0.2" 
            step="0.01" 
            value={params.attraction}
            onChange={(e) => setParams(p => ({...p, attraction: parseFloat(e.target.value)}))}
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

export default GenerativeForm;