"use client";

import { FeatureSteps } from "@/components/landingStudent/sections/3rdSection/feature-section";

const features = [
  {
    step: "Step 1",
    title: "Find listings for school credit.",
    content:
      "We called 1,600 companies — now their internships and MOA details are yours to explore.",
    image: "/landingPage/2ndSec/popimage3.png",
  },
  {
    step: "Step 2",
    title: "Get a response in a day.",
    content:
      "Get fast responses — employers are ranked by response time, so they're motivated to reply quickly.",
    image: "/landingPage/2ndSec/popimage1.png",
  },
  {
    step: "Step 3",
    title: "Check application progress.",
    content:
      "No more anxiety from not knowing — track in real time when your application is viewed, reviewed, or awaiting a decision.",
    image: "/landingPage/2ndSec/popimage2.png",
  },
];

export function PlatformSection() {
  return (
    <div className="border-t border-gray-900 h-[100vh] bg-black text-white">
      <FeatureSteps
        features={features}
        title="The complete internship platform for students."
        autoPlayInterval={10000}
        imageHeight="h-[500px]"
      />
    </div>
  );
}
