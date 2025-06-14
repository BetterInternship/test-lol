// Example usage of the generic Dock component
// You can use this pattern anywhere in your application

import React from 'react';
import { useRouter } from 'next/navigation';
import Dock from '@/components/ui/dock';
import { 
  Home, 
  Archive, 
  User, 
  Settings, 
  Search,
  FileText 
} from 'lucide-react';

export default function ExampleDockUsage() {
  const router = useRouter();

  const items = [
    { 
      icon: <Home size={18} />, 
      label: 'Home', 
      onClick: () => router.push('/') 
    },
    { 
      icon: <Search size={18} />, 
      label: 'Search', 
      onClick: () => router.push('/search') 
    },
    { 
      icon: <Archive size={18} />, 
      label: 'Archive', 
      onClick: () => alert('Archive!') 
    },
    { 
      icon: <FileText size={18} />, 
      label: 'Documents', 
      onClick: () => alert('Documents!') 
    },
    { 
      icon: <User size={18} />, 
      label: 'Profile', 
      onClick: () => router.push('/profile') 
    },
    { 
      icon: <Settings size={18} />, 
      label: 'Settings', 
      onClick: () => alert('Settings!') 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Your page content */}
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Example Page with Dock
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          This page demonstrates the dock component. The dock will only appear 
          on screens with width ≤ 1024px (tablets and mobile devices).
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Try resizing your browser window to see the dock appear/disappear.
        </p>
      </div>

      {/* Dock Component */}
      <Dock 
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
        showOnlyMobile={true} // Only show on mobile/tablet
      />
    </div>
  );
}

// Alternative usage - Always show the dock (desktop and mobile)
export function AlwaysVisibleDockExample() {
  const router = useRouter();

  const items = [
    { 
      icon: <Home size={18} />, 
      label: 'Home', 
      onClick: () => router.push('/') 
    },
    { 
      icon: <Search size={18} />, 
      label: 'Search', 
      onClick: () => router.push('/search') 
    },
    { 
      icon: <User size={18} />, 
      label: 'Profile', 
      onClick: () => router.push('/profile') 
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Your content */}
      
      <Dock 
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
        showOnlyMobile={false} // Show on all screen sizes
      />
    </div>
  );
}
