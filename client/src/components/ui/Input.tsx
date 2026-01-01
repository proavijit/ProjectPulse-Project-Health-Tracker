import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                className={`
                    px-4 py-2 border rounded-lg outline-none transition-all duration-200
                    ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}
                    placeholder:text-gray-400 text-gray-900
                `}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-500 font-medium">
                    {error}
                </span>
            )}
        </div>
    );
};
