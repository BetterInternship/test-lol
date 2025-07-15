"use client";

import { LogoCarousel } from "@/components/landingStudent/sections/5th section/companies";
import { Card, CardContent } from "@/components/landingStudent/ui/card";

const demoLogos = [
	{ id: 1, name: "Asian Institute of Management", src: "/logos/aim.png" },
	{ id: 2, name: "Alaska Milk Corporation", src: "/logos/alaska.png" },
	{ id: 3, name: "APC by Schneider Electric", src: "/logos/apc.jpeg" },
	{ id: 4, name: "Jollibee", src: "/logos/jollibee.png" },
	{ id: 5, name: "Manulife", src: "/logos/manulife.png" },
	{ id: 6, name: "Oracle", src: "/logos/oracle.png" },
	{ id: 7, name: "SeriousMD", src: "/logos/srsmd.jpeg" },
	{ id: 8, name: "Sun Life Financial", src: "/logos/sunlife.png" },
	{ id: 9, name: "WWF Philippines", src: "/logos/wwf.jpeg" },
];

function LogoCarouselBasic() {
	return (
		<div className="bg-black text-white dark:bg-black dark:text-white border-t border-gray-800">
			<Card className="bg-black text-white dark:bg-black dark:text-white">
				<CardContent className="py-6">
					<div className="text-center space-y-4 mb-12">
						<p className="text-sm font-medium tracking-widest text-muted-foreground dark:text-gray-400">
							TRUSTED BY TEAMS FROM AROUND THE COUNTRY
						</p>
						<h2 className="text-[3.5rem] font-bold tracking-tight leading-none text-gray-900 dark:text-white">
							The best are already here.
						</h2>
					</div>
					<LogoCarousel logos={demoLogos} />
				</CardContent>
			</Card>
		</div>
	);
}

export { LogoCarouselBasic };
