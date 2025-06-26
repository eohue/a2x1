'use client';

import React, { useState } from 'react';
import { Button } from './Button';

/**
 * Example usage of the Button component
 * This file demonstrates all the available variants, sizes, and states
 */
export const ButtonExamples = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Button Component Examples</h1>
      
      {/* Variants */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="danger">Danger Button</Button>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </section>

      {/* States */}
      <section>
        <h2 className="text-lg font-semibold mb-4">States</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
            <Button loading loadingText="Processing...">Custom Loading Text</Button>
          </div>
          
          <div>
            <Button onClick={handleLoadingDemo} loading={loading}>
              {loading ? undefined : 'Click to Demo Loading'}
            </Button>
          </div>
        </div>
      </section>

      {/* Full Width */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Full Width</h2>
        <div className="space-y-2">
          <Button fullWidth>Full Width Primary</Button>
          <Button variant="outline" fullWidth>Full Width Outline</Button>
        </div>
      </section>

      {/* Custom Classes */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Custom Styling</h2>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-none">
            Gradient Button
          </Button>
          <Button variant="outline" className="rounded-full px-8">
            Rounded Button
          </Button>
        </div>
      </section>

      {/* With Icons */}
      <section>
        <h2 className="text-lg font-semibold mb-4">With Icons (using Heroicons)</h2>
        <div className="flex flex-wrap gap-4">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </Button>
          <Button variant="danger">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ButtonExamples;
