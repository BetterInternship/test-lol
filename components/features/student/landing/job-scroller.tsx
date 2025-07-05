import ScrollingTestimonials from "@/components/animata/container/scrolling-testimonials";

export default function JobScroller() {
  return (
    <div className="p-6 flex justify-center overflow-hidden">
      <div className="max-w-4xl w-full overflow-hidden">
        <ScrollingTestimonials
          data={[
            {
              image: "/logos/Jollibee.png",
              name: "Jollibee",
            },
            {
              image: "/logos/Manulife.png",
              name: "Manulife",
            },
            {
              image: "/logos/SunLife.png",
              name: "Sun Life",
            },
            {
              image: "/logos/Oracle.png",
              name: "Oracle",
            },
            {
              image: "/logos/Alaska.png",
              name: "Alaska Milk Corporation",
            },
            {
              image: "/logos/WWF.png",
              name: "WWF",
            },
            {
              image: "/logos/AIM.png",
              name: "Asian Institute of Management",
            },
            {
              image: "/logos/APC.jpeg",
              name: "APC",
            },
          ]}
        />
      </div>
    </div>
  );
}
