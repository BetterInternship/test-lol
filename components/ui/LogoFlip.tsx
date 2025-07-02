import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import { useRouter } from "next/navigation";
import { useAppContext } from '@/lib/ctx-app';
import { cn } from '@/lib/utils';

interface Company {
  name: string;
  image: string;
}

interface CompanyPair {
  front: Company;
  back: Company;
}

interface CompanyCardProps {
  data: Company[];
}

function CompanyCard({
  companyPair: { front, back },
  index,
}: {
  companyPair: CompanyPair;
  index: number;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();
  const { isMobile } = useAppContext();

  useEffect(() => {
    // Random initial delay for each card
    const initialDelay = Math.random() * 3000;
    
    const flipInterval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 5000 + Math.random() * 4000); // Flip every 3-5 seconds randomly

    const timeoutId = setTimeout(() => {
      // Start the interval after initial delay
    }, initialDelay);

    return () => {
      clearInterval(flipInterval);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSearchClick = (companyName: string) => {
    router.push(`/search?q=${encodeURIComponent(companyName)}`);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
      <div 
        key="front" 
        className={cn(isMobile ? "h-16 w-28" : "h-20 w-36", "overflow-hidden rounded-[0.33em] border bg-white dark:border-zinc-700 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 flex items-center justify-center p-3")}
        onClick={() => handleSearchClick(front.name)}
      >
        <img 
          src={front.image} 
          alt={front.name} 
          className="h-full w-full object-contain"
          onError={(e) => {
            console.error(`Failed to load image: ${front.image}`);
            e.currentTarget.style.display = 'none';
          }}
          onLoad={() => console.log(`Successfully loaded: ${front.image}`)}
        />
      </div>

      <div 
        key="back" 
        className={cn(isMobile ? "h-16 w-28" : "h-20 w-36", "overflow-hidden rounded-[0.33em] border bg-white dark:border-zinc-700 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 flex items-center justify-center p-3")}
        onClick={() => handleSearchClick(back.name)}
      >
        <img 
          src={back.image} 
          alt={back.name} 
          className="h-full w-full object-contain"
          onError={(e) => {
            console.error(`Failed to load image: ${back.image}`);
            e.currentTarget.style.display = 'none';
          }}
          onLoad={() => console.log(`Successfully loaded: ${back.image}`)}
        />
      </div>
    </ReactCardFlip>
  );
}

export default function CompanyScroller({ data }: CompanyCardProps) {
  // Create pairs of companies and limit to 5 cards (10 companies total)
  const jobPairs: CompanyPair[] = [];
  
  for (let i = 0; i < data.length; i += 2) {
    if (i + 1 < data.length) {
      jobPairs.push({
        front: data[i],
        back: data[i + 1]
      });
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex gap-1 justify-center">
        {jobPairs.map((jobPair, index) => (
          <CompanyCard key={`${jobPair.front.name}-${jobPair.back.name}`} companyPair={jobPair} index={index} />
        ))}
      </div>
    </div>
  );
}