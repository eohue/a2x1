/**
 * Example usage of CommunityPreview component
 * 
 * This file demonstrates how to use the CommunityPreview component
 * in different scenarios like dashboard, sidebar, or standalone widget.
 */

import React from 'react';
import { CommunityPreview } from './CommunityPreview';

// Example 1: Basic usage in dashboard
export const DashboardCommunityPreview = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Community Preview with default settings */}
      <CommunityPreview />
    </div>
  );
};

// Example 2: Customized preview for sidebar
export const SidebarCommunityPreview = () => {
  return (
    <div className="w-80">
      <CommunityPreview
        maxPosts={3}
        showViewAllButton={false}
        className="shadow-none border-0"
      />
    </div>
  );
};

// Example 3: Compact preview for widget
export const CompactCommunityPreview = () => {
  return (
    <div className="max-w-md">
      <CommunityPreview
        maxPosts={2}
        showViewAllButton={true}
        className="bg-gray-50"
      />
    </div>
  );
};

// Example 4: Usage in dashboard page (how to integrate)
export const ExampleDashboardPage = () => {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Resident Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Other dashboard widgets */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          {/* Quick action buttons */}
        </div>
        
        {/* Community Preview */}
        <CommunityPreview maxPosts={4} />
        
        {/* Other widgets */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
          {/* Notifications content */}
        </div>
      </div>
    </main>
  );
};
