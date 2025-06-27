'use client';

import React, { useState } from 'react';
import { Input } from './Input';

// Example icons (using simple SVG icons)
const SearchIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
  </svg>
);

const MailIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const EyeIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ExclamationIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.636 0L4.268 16.5c-.77.833.192.5 1.732 2.5z" />
  </svg>
);

/**
 * Examples demonstrating different Input component configurations
 */
export const InputExamples = () => {
  const [controlledValue, setControlledValue] = useState('');
  const [validationExample, setValidationExample] = useState('');

  // Email validation function
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return null;
  };

  // Phone validation function
  const validatePhone = (value: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!value) return null; // Optional field
    if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
    return null;
  };

  return (
    <div className="p-8 space-y-12 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Input Component Examples</h1>
        <p className="text-gray-600">Comprehensive examples of the Input component with various configurations</p>
      </div>

      {/* Basic Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Basic Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Default Input</h3>
            <Input 
              label="Full Name" 
              placeholder="Enter your full name"
              helperText="This will be displayed on your profile"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Required Input</h3>
            <Input 
              label="Email Address" 
              type="email"
              placeholder="Enter your email"
              required
              helperText="We'll use this to contact you"
            />
          </div>
        </div>
      </section>

      {/* Size Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Size Variations</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Small</h3>
            <Input 
              label="Small Input" 
              size="sm"
              placeholder="Small input example"
              helperText="This is a small input"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Medium (Default)</h3>
            <Input 
              label="Medium Input" 
              size="md"
              placeholder="Medium input example"
              helperText="This is a medium input"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Large</h3>
            <Input 
              label="Large Input" 
              size="lg"
              placeholder="Large input example"
              helperText="This is a large input"
            />
          </div>
        </div>
      </section>

      {/* Icons Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">With Icons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Left Icon</h3>
            <Input 
              label="Search" 
              type="search"
              iconLeft={<SearchIcon />}
              placeholder="Search for something..."
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Right Icon</h3>
            <Input 
              label="Email" 
              type="email"
              iconRight={<MailIcon />}
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Both Icons</h3>
            <Input 
              label="Password" 
              type="password"
              iconLeft={<EyeIcon />}
              iconRight={<CheckIcon />}
              placeholder="Enter your password"
            />
          </div>
        </div>
      </section>

      {/* State Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">State Examples</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Error State</h3>
            <Input 
              label="Username" 
              error="Username is already taken"
              placeholder="Choose a username"
              iconRight={<ExclamationIcon />}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Success State</h3>
            <Input 
              label="Email" 
              type="email"
              success="Email is available"
              placeholder="Enter your email"
              iconRight={<CheckIcon />}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Disabled State</h3>
            <Input 
              label="Read Only Field" 
              disabled
              value="This field is disabled"
              helperText="This field cannot be edited"
            />
          </div>
        </div>
      </section>

      {/* Controlled vs Uncontrolled */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Controlled vs Uncontrolled</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Controlled</h3>
            <Input 
              label="Controlled Input" 
              value={controlledValue}
              onChange={(e) => setControlledValue(e.target.value)}
              placeholder="Type something..."
              helperText={`Current value: "${controlledValue}"`}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Uncontrolled</h3>
            <Input 
              label="Uncontrolled Input" 
              defaultValue="Default value"
              placeholder="Type something..."
              helperText="This input manages its own state"
            />
          </div>
        </div>
      </section>

      {/* Validation Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Validation Examples</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Email Validation (on blur)</h3>
            <Input 
              label="Email Address" 
              type="email"
              validate={validateEmail}
              validateOnBlur
              placeholder="Enter your email"
              iconLeft={<MailIcon />}
              helperText="Email will be validated when you click away"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Phone Validation (on change)</h3>
            <Input 
              label="Phone Number" 
              type="tel"
              validate={validatePhone}
              validateOnChange
              placeholder="Enter your phone number"
              helperText="Phone number will be validated as you type"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Combined Validation</h3>
            <Input 
              label="Validation Example" 
              value={validationExample}
              onChange={(e) => setValidationExample(e.target.value)}
              validate={(value) => {
                if (!value) return 'This field is required';
                if (value.length < 3) return 'Must be at least 3 characters';
                if (value.length > 20) return 'Must be less than 20 characters';
                return null;
              }}
              validateOnBlur
              validateOnChange
              placeholder="Enter 3-20 characters"
              helperText="Validates both on change and blur"
            />
          </div>
        </div>
      </section>

      {/* Different Input Types */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Input Types</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Text Input" 
            type="text"
            placeholder="Regular text input"
          />
          
          <Input 
            label="Email Input" 
            type="email"
            placeholder="email@example.com"
          />
          
          <Input 
            label="Password Input" 
            type="password"
            placeholder="Enter password"
          />
          
          <Input 
            label="Number Input" 
            type="number"
            placeholder="Enter a number"
          />
          
          <Input 
            label="Phone Input" 
            type="tel"
            placeholder="(123) 456-7890"
          />
          
          <Input 
            label="URL Input" 
            type="url"
            placeholder="https://example.com"
          />
          
          <Input 
            label="Search Input" 
            type="search"
            placeholder="Search..."
            iconLeft={<SearchIcon />}
          />
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Accessibility Features</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Hidden Label (Screen Reader Only)</h3>
            <Input 
              label="Hidden Label Input" 
              hideLabel
              placeholder="The label is hidden but still accessible"
              helperText="The label is hidden but still accessible to screen readers"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">ARIA Attributes</h3>
            <Input 
              label="ARIA Example" 
              placeholder="This input has proper ARIA attributes"
              helperText="This input automatically sets aria-invalid, aria-describedby, and other ARIA attributes"
              error="This demonstrates aria-invalid and role=alert"
            />
          </div>
        </div>
      </section>

      {/* Custom Styling */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Custom Styling</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Custom Classes</h3>
            <Input 
              label="Custom Styled Input" 
              className="bg-blue-50 border-blue-200"
              inputClassName="bg-white border-blue-300 focus:border-blue-500"
              labelClassName="text-blue-700 font-semibold"
              placeholder="Custom styled input"
              helperText="This input has custom styling applied"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default InputExamples;
