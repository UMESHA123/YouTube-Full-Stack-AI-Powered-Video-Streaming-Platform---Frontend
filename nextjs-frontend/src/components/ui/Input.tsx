import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

const Input: React.FC<InputProps> = ({ icon: Icon, className = '', ...props }) => {
  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors duration-200 pointer-events-none">
          <Icon size={20} strokeWidth={1.5} />
        </div>
      )}
      <input
        className={`
          w-full
          bg-[#0f0f11]
          border border-white/10
          text-white
          placeholder-gray-500
          text-sm
          rounded-xl
          py-3.5
          ${Icon ? 'pl-12' : 'pl-4'}
          pr-4
          outline-none
          transition-all duration-200
          ${className}  /* ✅ className last so it can override focus styles */
        `}
        {...props}
      />
    </div>
  );
};

export default Input;
