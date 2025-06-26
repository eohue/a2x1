'use client';

import React from 'react';
import { LanguageSwitcher, LanguageSwitcherDropdown, LanguageSwitcherPills } from './LanguageSwitcher';

/**
 * Examples demonstrating different configurations of the LanguageSwitcher component
 */

// Basic dropdown example
export const BasicDropdownExample = () => (
  <div className="p-4 border rounded-lg">
    <h3 className="text-lg font-semibold mb-4">Basic Dropdown</h3>
    <div className="flex justify-end">
      <LanguageSwitcher />
    </div>
  </div>
);

// Pills mode example
export const PillsExample = () => (
  <div className="p-4 border rounded-lg">
    <h3 className="text-lg font-semibold mb-4">Pill Buttons</h3>
    <div className="flex justify-center">
      <LanguageSwitcher mode="pills" />
    </div>
  </div>
);

// Codes only example
export const CodesOnlyExample = () => (
  <div className="p-4 border rounded-lg">
    <h3 className="text-lg font-semibold mb-4">Codes Only</h3>
    <div className="flex justify-center">
      <LanguageSwitcher mode="pills" showCodesOnly />
    </div>
  </div>
);

// No flags example
export const NoFlagsExample = () => (
  <div className="p-4 border rounded-lg">
    <h3 className="text-lg font-semibold mb-4">No Flags</h3>
    <div className="flex justify-center">
      <LanguageSwitcher mode="pills" showFlags={false} />
    </div>
  </div>
);

// Header usage example
export const HeaderExample = () => (
  <div className="border rounded-lg overflow-hidden">
    <header className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold text-primary-600">ibookee</div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Projects</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Community</a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-900">Login</button>
        <LanguageSwitcher />
      </div>
    </header>
    <div className="p-6 text-center text-gray-500">
      Example header with language switcher
    </div>
  </div>
);

// Navigation bar example
export const NavigationExample = () => (
  <div className="border rounded-lg overflow-hidden">
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b">
      <div className="flex items-center space-x-8">
        <div className="text-lg font-semibold">Settings</div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Language:</span>
        <LanguageSwitcherPills showCodesOnly />
      </div>
    </nav>
    <div className="p-6 text-center text-gray-500">
      Example navigation with pill switcher
    </div>
  </div>
);

// Settings page example
export const SettingsExample = () => (
  <div className="max-w-md mx-auto p-6 border rounded-lg">
    <h2 className="text-xl font-semibold mb-6">Preferences</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme
        </label>
        <select className="w-full border rounded-md px-3 py-2">
          <option>Light</option>
          <option>Dark</option>
          <option>System</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language
        </label>
        <LanguageSwitcher mode="pills" className="w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notifications
        </label>
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm">Email notifications</span>
        </div>
      </div>
    </div>
  </div>
);

// Responsive example
export const ResponsiveExample = () => (
  <div className="border rounded-lg overflow-hidden">
    <div className="p-4 bg-gray-50 border-b">
      <h3 className="text-lg font-semibold">Responsive Layout</h3>
      <p className="text-sm text-gray-600 mt-1">
        Dropdown on mobile, pills on desktop
      </p>
    </div>
    <div className="p-6">
      {/* Mobile: Dropdown */}
      <div className="md:hidden mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Mobile View:</div>
        <LanguageSwitcher mode="dropdown" />
      </div>
      
      {/* Desktop: Pills */}
      <div className="hidden md:block">
        <div className="text-sm font-medium text-gray-700 mb-2">Desktop View:</div>
        <LanguageSwitcher mode="pills" />
      </div>
    </div>
  </div>
);

// Convenience exports example
export const ConvenienceExportsExample = () => (
  <div className="space-y-6">
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">LanguageSwitcherDropdown</h3>
      <div className="flex justify-end">
        <LanguageSwitcherDropdown />
      </div>
    </div>
    
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">LanguageSwitcherPills</h3>
      <div className="flex justify-center">
        <LanguageSwitcherPills />
      </div>
    </div>
  </div>
);

// All examples component for demonstration
export const AllExamples = () => (
  <div className="space-y-8 p-8">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">LanguageSwitcher Examples</h1>
      <p className="text-gray-600">Various configurations and usage patterns</p>
    </div>
    
    <BasicDropdownExample />
    <PillsExample />
    <CodesOnlyExample />
    <NoFlagsExample />
    <HeaderExample />
    <NavigationExample />
    <SettingsExample />
    <ResponsiveExample />
    <ConvenienceExportsExample />
  </div>
);

export default AllExamples;
