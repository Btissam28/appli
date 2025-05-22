import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, icon, className = '', ...props }, ref) => {
    const baseStyles = 'block px-4 py-2 rounded-md border focus:ring-2 focus:ring-offset-0 focus:outline-none transition-all duration-200';
    
    const stateStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    
    const widthStyles = fullWidth ? 'w-full' : '';
    const iconStyles = icon ? 'pl-10' : '';
    
    const inputStyles = `${baseStyles} ${stateStyles} ${widthStyles} ${iconStyles} ${className}`;
    
    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label htmlFor={props.id} className="block mb-1 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
          <input ref={ref} className={inputStyles} {...props} />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;