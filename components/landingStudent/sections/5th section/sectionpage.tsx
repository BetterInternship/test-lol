"use client";

import { LogoCarousel } from "@/components/landingStudent/sections/5th section/companies";
import { Card, CardContent } from "@/components/landingStudent/ui/card";

const demoLogos = [
  {
    id: 1,
    name: "Asian Institute of Management",
    src: "/landingPage/logos/aim.png",
  },
  {
    id: 2,
    name: "Alaska Milk Corporation",
    src: "/landingPage/logos/alaska.png",
  },
  {
    id: 3,
    name: "APC by Schneider Electric",
    src: "/landingPage/logos/apc.jpeg",
  },
  { id: 4, name: "Jollibee", src: "/landingPage/logos/jollibee.png" },
  { id: 5, name: "Manulife", src: "/landingPage/logos/manulife.png" },
  { id: 6, name: "Oracle", src: "/landingPage/logos/oracle.png" },
  { id: 7, name: "SeriousMD", src: "/landingPage/logos/srsmd.jpeg" },
  { id: 8, name: "Sun Life Financial", src: "/landingPage/logos/sunlife.png" },
  { id: 9, name: "WWF Philippines", src: "/landingPage/logos/wwf.jpeg" },
  { id: 10, name: "MegaWorld", src: "/landingPage/logos/megaworld.png" },
];

function LogoCarouselBasic() {
  return (
    <div className="bg-black text-white dark:bg-black dark:text-white border-t border-gray-900">
      <Card className="bg-black text-white dark:bg-black dark:text-white">
        <CardContent className="pt-6 p-0 bg-white">
          <div className="text-center space-y-4">
            <h2 className="text-[3.5rem] font-bold tracking-tight leading-none text-gray-800 text-opacity-[0.33] pb-6 pt-40">
              The best are already here.
            </h2>
          </div>
          <LogoCarousel logos={demoLogos} />
          <div className="h-[20vh]"></div>
        </CardContent>
      </Card>
    </div>
  );
}

export { LogoCarouselBasic };
