import ScrollingTestimonials from "@/components/animata/container/scrolling-testimonials";

export default function Page() {
  return (
    <div className="p-6 flex justify-center overflow-hidden">
      <div className="max-w-4xl w-full overflow-hidden">
        <ScrollingTestimonials
          data={[
            {
              image: "/logos/manulife.png",
              name: "Manulife",
            },
            {
              image: "/logos/jollibee.png",
              name: "Jollibee",
            },
            {
              image: "/logos/sunlife.png",
              name: "Sun Life Financial",
            },
            {
              image: "/logos/oracle.png",
              name: "Oracle",
            },
            {
              image: "/logos/alaska.png",
              name: "Alaska Milk Corporation",
            },
            {
              image: "/logos/wwf.png",
              name: "WWF",
            },
            {
              image: "/logos/AIM.png",
              name: "Asian Institute of Management",
            },
            {
              image: "/logos/apc.jpeg",
              name: "APC",
            },
          ]}
        />
      </div>
    </div>
  );
}
