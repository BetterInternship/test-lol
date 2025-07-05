import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const router = useRouter();

  const handleRequestAccess = () => {
    router.push('/login');
  };
  return (
    <div className="flex flex-col items-center justify-center w-full px-8 py-8 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
          Interns? Done.
        </h1>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
          We are largest platform dedicated to hiring PH interns.
        </p>
        
        {/* Value Proposition */}
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Always free to use. Loved by students. Mindblowingly efficient.
        </p>
        
        {/* Statistics */}
        <div className="mb-12">
          <p className="text-base md:text-lg text-gray-700">
            Average Company saves{' '}
            <span className="text-2xl md:text-3xl font-bold text-black">125</span>{' '}
            hours/year (10 interns)
          </p>
        </div>
        
        {/* CTA Button */}
        <div className="flex justify-center">
          <Button 
            className="px-8 md:px-12 text-base md:text-lg font-medium bg-black text-white border-2 border-black hover:bg-white hover:text-black hover:shadow-lg transition-all duration-200"
            size="lg"
            onClick={handleRequestAccess}
          >
            Request Access
          </Button>
        </div>
      </div>
    </div>
  );
}