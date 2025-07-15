"use client"

import { FeatureSteps } from "@/components/landingStudent/sections/3rdSection/feature-section"

const features = [
  { 
    step: 'Step 1',
    title: 'Find listings for school credit.',
    content: 'Discover internships that count towards your school requirements and academic credit.',
    image: '/landingPage/2ndSec/popimage3.png'
  },
  { 
    step: 'Step 2', 
    title: 'Get a response in a day.',
    content: 'Receive updates quickly—employers are notified instantly when you apply.',
    image: '/landingPage/2ndSec/popimage1.png'
  },
  { 
    step: 'Step 3',
    title: 'Check application progress.',
    content: 'Track your application status, see if you’re up for an interview, or under review.',
    image: '/landingPage/2ndSec/popimage2.png'
  },
]

export function PlatformSection() {
  return (
    <div className="border-t border-gray-900 h-[100vh] bg-black text-white">
      <FeatureSteps 
        features={features}
        title="The complete internship platform for students."
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
      />
    </div>
  )
}


