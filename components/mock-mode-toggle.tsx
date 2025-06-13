// Mock Mode Toggle Component
"use client";

import React, { useEffect, useState } from 'react';
import { getMockConfig, setMockConfig, resetMockData, seedMockData } from '@/lib/mock';

export const MockModeToggle: React.FC = () => {
  const [config, setConfig] = useState(getMockConfig());
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    // Update config when it changes
    const checkConfig = () => {
      setConfig(getMockConfig());
    };

    // Check for config changes periodically
    const interval = setInterval(checkConfig, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    setMockConfig({ enabled: !config.enabled });
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const delay = parseInt(e.target.value) || 0;
    setMockConfig({ delay });
    setConfig({ ...config, delay });
  };

  const handleFailureRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const failureRate = parseInt(e.target.value) || 0;
    setMockConfig({ failureRate });
    setConfig({ ...config, failureRate });
  };

  const handleLoggingToggle = () => {
    setMockConfig({ logging: !config.logging });
    setConfig({ ...config, logging: !config.logging });
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all ${
          config.enabled 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-gray-500 hover:bg-gray-600 text-white'
        }`}
        title="Mock Mode Settings"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      {/* Settings Panel */}
      {showPanel && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-white rounded-lg shadow-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Mock Mode Settings</h3>
          
          {/* Enable/Disable Toggle */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={handleToggle}
                className="mr-2 h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">
                Mock Mode {config.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          {/* Settings (only show when enabled) */}
          {config.enabled && (
            <>
              {/* Network Delay */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Network Delay (ms)
                </label>
                <input
                  type="number"
                  value={config.delay || 0}
                  onChange={handleDelayChange}
                  className="w-full px-3 py-1 border rounded text-sm"
                  min="0"
                  max="5000"
                  step="100"
                />
              </div>

              {/* Failure Rate */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Failure Rate (%)
                </label>
                <input
                  type="number"
                  value={config.failureRate || 0}
                  onChange={handleFailureRateChange}
                  className="w-full px-3 py-1 border rounded text-sm"
                  min="0"
                  max="100"
                  step="5"
                />
              </div>
              {/* Logging Toggle */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.logging ?? true}
                    onChange={handleLoggingToggle}
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium">Enable Logging</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => {
                    resetMockData();
                    alert('Mock data reset!');
                  }}
                  className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Reset Data
                </button>
                <button
                  onClick={() => {
                    seedMockData({ users: 5, jobs: 10 });
                    alert('Mock data seeded!');
                  }}
                  className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Seed Data
                </button>
              </div>
            </>
          )}

          {/* Info */}
          <div className="mt-4 text-xs text-gray-500">
            <p>Mock mode intercepts API calls and returns fake data.</p>
            <p className="mt-1">Page will reload when toggling mock mode.</p>
          </div>
        </div>
      )}
    </>
  );
};