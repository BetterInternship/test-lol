import { SoftwareSection } from "./use-cardstack";

export function Feature() {
  return (
    <div className="w-full py-20 border-t border-gray-900 overflow-hidden h-[100vh] bg-black text-white dark:bg-black dark:text-white">
      <div className="flex flex-col lg:flex-row lg:items-center gap-20">
        <div className="flex gap-4 pl-0 lg:pl-20 flex-col flex-1">
          <div className="flex gap-2 mx-8 flex-col z-30">
            <h2 className="text-7xl tracking-tighter lg:max-w-xl font-regular text-left text-gray-900 dark:text-white">
              Apply fast, Get Hired faster.
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left dark:text-gray-400">
              Instantly apply to jobs with a single click—no forms, no hassle.
            </p>
          </div>
        </div>
        <div className="relative group items-center justify-center w-full flex-1">
          <div className="relative z-10">
            <SoftwareSection />
          </div>
        </div>
      </div>
    </div>
  );
}

