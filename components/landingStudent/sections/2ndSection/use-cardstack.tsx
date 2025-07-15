"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { motionVariants } from "@/lib/landingStudentLib/animations";
import CardSwap, {
  Card,
} from "@/components/landingStudent/sections/2ndSection/CardSwap/CardSwap";
import { useEffect, useState } from "react";
import Link from "next/link";

function useResponsiveCardSwap() {
  const [cardProps, setCardProps] = useState({
    cardDistance: 80,
    verticalDistance: 80,
    width: 450,
    height: 500,
    skew: 2,
  });

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        // Mobile
        setCardProps({
          cardDistance: 25,
          verticalDistance: 25,
          width: 360,
          height: 540,
          skew: 2,
        });
      } else if (window.innerWidth < 1024) {
        // Tablet
        setCardProps({
          cardDistance: 30,
          verticalDistance: 30,
          width: 380,
          height: 540,
          skew: 2,
        });
      } else {
        // Desktop
        setCardProps({
          cardDistance: 60,
          verticalDistance: 60,
          width: 400,
          height: 500,
          skew: 2,
        });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return cardProps;
}

export function SoftwareSection() {
  const { cardDistance, verticalDistance, width, height, skew } =
    useResponsiveCardSwap();

  return (
    <section className="bg-black">
      <div className="max-w-7xl text-white sm:px-6 lg:px-8">
        {/* Main Layout with Header Left and Cards Center-Right */}
        <motion.div
          {...motionVariants.fadeInUp}
          transition={{ ...motionVariants.fadeInUp.transition, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center"
        >
          {/* Right Side - CardSwap */}
          <div className="flex-1 flex relative pl-12 justify-center">
            <div className="relative pt-24 sm:pt-32 lg:pt-96">
              <CardSwap
                width={width}
                height={height}
                cardDistance={cardDistance}
                verticalDistance={verticalDistance}
                delay={3500}
                pauseOnHover={false}
                skewAmount={skew}
                easing="elastic"
              >
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-white-700/50 p-8 hover:cursor-pointer">
                  <Link href="/search">
                    <div className="text-white h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          New
                        </span>
                        <span className="text-sm text-slate-300">
                          Just posted
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold mb-3 text-white">
                        Software Engineer Intern
                      </h4>
                      <p className="text-slate-200 mb-4 text-lg">
                        TechCorp Philippines
                      </p>
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center text-slate-300">
                          <span className="mr-3">💰</span>
                          <span>₱25,000/month</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <span className="mr-3">📍</span>
                          <span>Makati, Metro Manila</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <span className="mr-3">⏰</span>
                          <span>3-6 months</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <span className="mr-3">🎓</span>
                          <span>Computer Science</span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <Button className="w-full bg-white text-slate-800 hover:bg-slate-100 font-semibold py-3">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>

                <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-white-700/50 p-8 hover:cursor-pointer">
                  <Link href="/search">
                    <div className="text-white h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-zinc-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Hot
                        </span>
                        <span className="text-sm text-zinc-300">
                          2 days ago
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold mb-3 text-white">
                        Marketing Intern
                      </h4>
                      <p className="text-zinc-200 mb-4 text-lg">
                        Global Marketing Inc.
                      </p>
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center text-zinc-300">
                          <span className="mr-3">💰</span>
                          <span>₱20,000/month</span>
                        </div>
                        <div className="flex items-center text-zinc-300">
                          <span className="mr-3">📍</span>
                          <span>BGC, Taguig</span>
                        </div>
                        <div className="flex items-center text-zinc-300">
                          <span className="mr-3">⏰</span>
                          <span>4-6 months</span>
                        </div>
                        <div className="flex items-center text-zinc-300">
                          <span className="mr-3">🎓</span>
                          <span>Marketing/Business</span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <Button className="w-full bg-white text-zinc-800 hover:bg-zinc-100 font-semibold py-3">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>

                <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700/50 p-8 hover:cursor-pointer">
                  <Link href="/search">
                    <div className="text-white h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-neutral-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                        <span className="text-sm text-neutral-300">
                          5 days ago
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold mb-3 text-white">
                        Data Science Intern
                      </h4>
                      <p className="text-neutral-200 mb-4 text-lg">
                        Analytics Solutions Co.
                      </p>
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center text-neutral-300">
                          <span className="mr-3">💰</span>
                          <span>₱30,000/month</span>
                        </div>
                        <div className="flex items-center text-neutral-300">
                          <span className="mr-3">📍</span>
                          <span>Quezon City</span>
                        </div>
                        <div className="flex items-center text-neutral-300">
                          <span className="mr-3">⏰</span>
                          <span>6 months</span>
                        </div>
                        <div className="flex items-center text-neutral-300">
                          <span className="mr-3">🎓</span>
                          <span>Data Science/Stats</span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <Button className="w-full bg-white text-neutral-800 hover:bg-neutral-100 font-semibold py-3">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>

                <Card className="bg-gradient-to-br from-stone-800 to-stone-900 border-stone-700/50 p-8 hover:cursor-pointer">
                  <Link href="/search">
                    <div className="text-white h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-stone-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Urgent
                        </span>
                        <span className="text-sm text-stone-300">
                          1 week ago
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold mb-3 text-white">
                        UX Design Intern
                      </h4>
                      <p className="text-stone-200 mb-4 text-lg">
                        Creative Design Studio
                      </p>
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center text-stone-300">
                          <span className="mr-3">💰</span>
                          <span>₱22,000/month</span>
                        </div>
                        <div className="flex items-center text-stone-300">
                          <span className="mr-3">📍</span>
                          <span>Pasig City</span>
                        </div>
                        <div className="flex items-center text-stone-300">
                          <span className="mr-3">⏰</span>
                          <span>3-4 months</span>
                        </div>
                        <div className="flex items-center text-stone-300">
                          <span className="mr-3">🎓</span>
                          <span>Design/Arts</span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <Button className="w-full bg-white text-stone-800 hover:bg-stone-100 font-semibold py-3">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800/50 p-8 hover:cursor-pointer">
                  <Link href="/search">
                    <div className="text-white h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Premium
                        </span>
                        <span className="text-sm text-gray-300">
                          3 days ago
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold mb-3 text-white">
                        Finance Intern
                      </h4>
                      <p className="text-gray-200 mb-4 text-lg">
                        Investment Bank Corp
                      </p>
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center text-gray-300">
                          <span className="mr-3">💰</span>
                          <span>₱35,000/month</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <span className="mr-3">📍</span>
                          <span>Makati CBD</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <span className="mr-3">⏰</span>
                          <span>6-12 months</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <span className="mr-3">🎓</span>
                          <span>Finance/Economics</span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <Button className="w-full bg-white text-gray-800 hover:bg-gray-100 font-semibold py-3">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900 to-black border-slate-800/50 p-8 hover:cursor-pointer">
                  <Link href="/search">
                    <div className="text-white h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-slate-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Remote
                        </span>
                        <span className="text-sm text-slate-300">
                          4 days ago
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold mb-3 text-white">
                        Content Writer Intern
                      </h4>
                      <p className="text-slate-200 mb-4 text-lg">
                        Digital Media Agency
                      </p>
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center text-slate-300">
                          <span className="mr-3">💰</span>
                          <span>₱18,000/month</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <span className="mr-3">📍</span>
                          <span>Remote/Hybrid</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <span className="mr-3">⏰</span>
                          <span>3-6 months</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <span className="mr-3">🎓</span>
                          <span>English/Journalism</span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <Button className="w-full bg-white text-slate-800 hover:bg-slate-100 font-semibold py-3">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              </CardSwap>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
