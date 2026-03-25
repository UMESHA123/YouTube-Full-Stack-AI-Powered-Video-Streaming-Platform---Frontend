import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Dark Base */}
      <div className="absolute inset-0 bg-[#050508]" />
      
      {/* Top Left Blue Glow */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full opacity-40 mix-blend-screen" />
      
      {/* Bottom Right Purple Glow */}
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full opacity-40 mix-blend-screen" />

      {/* Subtle Center Haze */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(30,30,40,0.1)_0%,rgba(0,0,0,0)_70%)]" />
    </div>
  );
};

export default Background;