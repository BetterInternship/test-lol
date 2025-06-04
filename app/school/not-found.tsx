import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/school/ui/button";
import { NotFound as NotFoundImage } from "@/lib/images";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center space-y-4 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          404 Not Found
        </h1>
        <p className="mx-auto max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Oops! You{"'ve"} navigated to an unknown URL.
        </p>
      </div>
      <Image
        unoptimized
        src={NotFoundImage}
        alt="404 Not Found"
        width={500}
        height={500}
      />
      <Link href="/">
        <Button className="inline-flex h-10 items-center px-8 text-sm font-medium shadow-sm transition-colors">
          Go to Home
        </Button>
      </Link>
    </div>
  );
}
