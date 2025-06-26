import React from 'react';
import { ApplicationCTA } from './ApplicationCTA';

/**
 * ApplicationCTA Examples
 * 
 * This file demonstrates how to use the ApplicationCTA component
 * in different contexts within your application.
 */

// Example 1: Basic usage in a page
export function BasicUsageExample() {
  return (
    <div>
      {/* Other page content */}
      <div className="some-content">
        <h1>Welcome to our platform</h1>
        <p>Some other content...</p>
      </div>
      
      {/* ApplicationCTA Section */}
      <ApplicationCTA />
      
      {/* Application form section that the CTA will scroll to */}
      <section id="application" className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Application Form</h2>
          {/* Your application form components here */}
          <form>
            {/* Form fields */}
          </form>
        </div>
      </section>
    </div>
  );
}

// Example 2: Usage in a home page layout
export function HomePageExample() {
  return (
    <main>
      {/* Hero section */}
      <section className="hero-section">
        {/* Hero content */}
      </section>
      
      {/* Features/Benefits section */}
      <section className="features-section">
        {/* Features content */}
      </section>
      
      {/* CTA Section - typically placed before the final call to action */}
      <ApplicationCTA />
      
      {/* Final sections */}
      <section className="testimonials">
        {/* Testimonials */}
      </section>
    </main>
  );
}

// Example 3: Usage with custom application section ID
export function CustomScrollTargetExample() {
  const handleCustomApplyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const customSection = document.getElementById('custom-application-form');
    if (customSection) {
      customSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <div>
      {/* Modified ApplicationCTA with custom button handler */}
      <section className="relative w-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-16 sm:py-20 lg:py-24">
        {/* You would need to modify ApplicationCTA to accept custom onClick handler
            or create a custom version for specific use cases */}
      </section>
      
      {/* Custom application section */}
      <section id="custom-application-form" className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Custom Application Form</h2>
          {/* Custom form content */}
        </div>
      </section>
    </div>
  );
}

// Example 4: Usage with additional spacing/layout considerations
export function LayoutOptimizedExample() {
  return (
    <div className="min-h-screen">
      {/* Page content with proper spacing */}
      <div className="space-y-16">
        
        {/* Content sections */}
        <section className="py-16">
          {/* Content */}
        </section>
        
        <section className="py-16">
          {/* More content */}
        </section>
        
        {/* CTA Section - note: no additional padding needed as component handles it */}
        <ApplicationCTA />
        
        {/* Application form - with proper spacing from CTA */}
        <section id="application" className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Apply for Housing</h2>
            {/* Application form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Form content */}
              <p className="text-gray-600">Your application form would go here...</p>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}

export default ApplicationCTA;
