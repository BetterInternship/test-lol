import { Card } from "@/components/ui/our-card";

// To delete
export const MobilePlaceholder = () => {
  return (
    <div className="top-0 left-0 fixed w-[100vw] h-[100vh] bg-white flex flex-row items-center z-[99999] overflow-hidden">
      <div className="max-w-full m-auto p-8">
        <div className="flex flex-row justify-center w-full opacity-50">
          <h1 className="block text-4xl font-heading font-bold mb-8">
            BetterInternship
          </h1>
        </div>
        <Card>
          We are currently working on improving the mobile experience on our
          platform for employers. Stay tuned for updates!
        </Card>
      </div>
    </div>
  );
};
