import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import ExperimentalDesign from '@/components/ExperimentalDesign';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <ExperimentalDesign />
      <Toaster />
    </div>
  );
}

export default App;