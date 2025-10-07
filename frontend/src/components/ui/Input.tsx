import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      
        // {label && (
          
        //     {label}
        //     {props.required && *}
          
        // )}
        
        // {error && (
        //   {error}
        // )}
        // {helperText && !error && (
        //   {helperText}
        // )}
      
    );
  }
);

Input.displayName = 'Input';

export default Input;
