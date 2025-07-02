import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import { useRouter } from "next/navigation";

interface Job {
  name: string;
  image: string;
}

interface JobPair {
  front: Job;
  back: Job;
}

interface JobScrollerProps {
  data: Job[];
}

function JobCard({
  jobPair: { front, back },
  index,
}: {
  jobPair: JobPair;
  index: number;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Random initial delay for each card
    const initialDelay = Math.random() * 3000;
    
    const flipInterval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 3000 + Math.random() * 2000); // Flip every 3-5 seconds randomly

    const timeoutId = setTimeout(() => {
      // Start the interval after initial delay
    }, initialDelay);

    return () => {
      clearInterval(flipInterval);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSearchClick = (jobName: string) => {
    router.push(`/search?q=${encodeURIComponent(jobName)}`);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
      <div 
        key="front" 
        className="h-24 w-36 overflow-hidden rounded-xl border bg-white dark:border-zinc-700 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 flex items-center justify-center p-3"
        onClick={() => handleSearchClick(front.name)}
      >
        <img src={front.image} alt={front.name} className="h-full w-full object-contain" />
      </div>

      <div 
        key="back" 
        className="h-24 w-36 overflow-hidden rounded-xl border bg-white dark:border-zinc-700 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 relative flex items-center justify-center p-3"
        onClick={() => handleSearchClick(back.name)}
      >
        <img src={back.image} alt={back.name} className="h-full w-full object-contain" />
      </div>
    </ReactCardFlip>
  );
}

export default function JobScroller({ data }: JobScrollerProps) {
  // Create pairs of companies and limit to 5 cards (10 companies total)
  const jobPairs: JobPair[] = [];
  const limitedData = data.slice(0, 10); // Take first 10 companies for 5 cards
  
  for (let i = 0; i < limitedData.length; i += 2) {
    if (i + 1 < limitedData.length) {
      jobPairs.push({
        front: limitedData[i],
        back: limitedData[i + 1]
      });
    }
  }

  // Ensure we have exactly 5 pairs
  const displayPairs = jobPairs.slice(0, 5);

  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-4 justify-center">
        {displayPairs.map((jobPair, index) => (
          <JobCard key={`${jobPair.front.name}-${jobPair.back.name}`} jobPair={jobPair} index={index} />
        ))}
      </div>
    </div>
  );
}