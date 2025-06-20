import React from "react";
import Image from "next/image";
import { Missing, NotFound } from "@/lib/images";

interface Props {
  error: boolean;
  text: string;
}

const ErrorIllustration = ({ error, text }: Props) => {
  return (
    <>
      {error ? (
        <div className="flex flex-col items-center justify-center">
          <Image
            unoptimized
            src={Missing}
            alt="No data"
            placeholder={"blur"}
            className="-mb-5 mt-5 aspect-auto h-32 w-32 md:h-60 md:w-60"
          />
          <div className="flex flex-col items-center justify-center gap-2.5">
            <div className="text-lg font-medium">
              An error occurred while fetching data
            </div>
            <div className="text-base text-muted-foreground">
              Please try again later
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2.5">
          <Image
            unoptimized
            src={NotFound}
            alt="No data"
            className="-mb-5 mt-5 aspect-auto h-32 w-32 md:h-60 md:w-60"
          />
          <div className="flex flex-col items-center justify-center gap-2.5">
            <div className="font-muted-foreground whitespace-pre-wrap text-center text-sm md:text-base">
              {text}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ErrorIllustration;
