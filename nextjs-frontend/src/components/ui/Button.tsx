import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, fullWidth = false, className, ...props }) => {
  return (
    <button
      className={`
        relative overflow-hidden
        bg-gradient-to-r from-blue-600 to-purple-600
        hover:from-blue-500 hover:to-purple-500
        text-white font-semibold 
        py-3.5 px-6 
        rounded-xl 
        transition-all duration-300
        shadow-[0_0_20px_rgba(79,70,229,0.3)]
        hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]
        active:scale-[0.98]
        flex items-center justify-center gap-2
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;