import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParametricSpiral from '@/components/graphics/ParametricSpiral';
import FourierWaves from '@/components/graphics/FourierWaves';
import GeometricPattern from '@/components/graphics/GeometricPattern';
import AlgorithmicNoise from '@/components/graphics/AlgorithmicNoise';
import TopologyMesh from '@/components/graphics/TopologyMesh';
import DataVisualization from '@/components/graphics/DataVisualization';
import ModularGrid from '@/components/graphics/ModularGrid';
import SymmetryPattern from '@/components/graphics/SymmetryPattern';
import GenerativeForm from '@/components/graphics/GenerativeForm';
import ComputationalField from '@/components/graphics/ComputationalField';
import AnimatedLogo from '@/components/AnimatedLogo';

const ExperimentalDesign = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const logoUrl = "https://chrisboari.com/chris-boari-creative-art-logo.svg";

  const sections = [
    { title: 'parametric', component: ParametricSpiral },
    { title: 'fourier', component: FourierWaves },
    { title: 'geometric', component: GeometricPattern },
    { title: 'algorithmic', component: AlgorithmicNoise },
    { title: 'topology', component: TopologyMesh },
    { title: 'data-driven', component: DataVisualization },
    { title: 'modular', component: ModularGrid },
    { title: 'symmetry', component: SymmetryPattern },
    { title: 'generative', component: GenerativeForm },
    { title: 'computational', component: ComputationalField }
  ];

  const keywords = [
    'design', 'technology', 'experimentation', 'innovation',
    'algorithm', 'parametric', 'geometric', 'computation',
    'pattern', 'structure', 'topology', 'generative',
    'iteration', 'modularity', 'visualization', 'data-driven',
    'symmetry', 'abstraction', 'digital fabrication', 'form-finding'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % sections.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [sections.length]);

  const CurrentComponent = sections[currentSection].component;

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-black/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.02 }}>
              <AnimatedLogo src={logoUrl} className="h-8 w-auto text-black" />
              <span className="text-sm font-medium tracking-tight">Chris Boari Creative Art</span>
            </motion.div>
            
            <nav className="flex space-x-8">
              {['art', 'technology', 'innovation'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-sm hover:opacity-60 transition-opacity"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h2 
                className="text-4xl md:text-6xl font-light leading-tight mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                creative
                <br />
                <span className="font-medium">explorations</span>
              </motion.h2>
              
              <motion.p 
                className="text-sm leading-relaxed mb-8 max-w-md opacity-70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Navigating the intersection of computational art, geometry, and visual form through 
                interactive mathematical expressions and algorithmic design patterns.
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-2 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                {keywords.slice(0, 8).map((keyword, index) => (
                  <motion.span
                    key={keyword}
                    className="px-2 py-1 border border-black/20 rounded hover:bg-black hover:text-white transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                  >
                    {keyword}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            <motion.div 
              className="h-96 bg-gray-50 border border-black/10 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <CurrentComponent />
              
              <div className="absolute bottom-4 left-4 text-xs opacity-60">
                {sections[currentSection].title}
                <span className="ml-2">
                  {String(currentSection + 1).padStart(2, '0')}/10
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Graphics Grid */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <motion.h3 
            className="text-2xl font-light mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            interactive.experiments
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => {
              const Component = section.component;
              return (
                <motion.div
                  key={section.title}
                  className="aspect-square bg-gray-50 border border-black/10 relative overflow-hidden group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setCurrentSection(index)}
                >
                  <Component />
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  <div className="absolute bottom-4 left-4 text-xs">
                    <div className="font-medium">{section.title}</div>
                    <div className="opacity-60 text-[10px]">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Keywords Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-lg font-light mb-8">methodology</h3>
            
            <div className="flex flex-wrap justify-center gap-3 text-xs max-w-4xl mx-auto">
              {keywords.map((keyword, index) => (
                <motion.span
                  key={keyword}
                  className="px-3 py-2 border border-black/20 rounded hover:bg-black hover:text-white transition-colors cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center text-xs opacity-60">
            <span>Chris Boari Creative Art</span>
            <span>art & technology © 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ExperimentalDesign;