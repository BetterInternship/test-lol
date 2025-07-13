import { Card } from "./our-card";

export const Message = ({
  message,
  self,
}: {
  message: string;
  self?: boolean;
}) => {
  return !self ? (
    <Card className="py-2 px-4 w-fit text-sm w-prose max-w-full text-wrap break-words">
      {message}
    </Card>
  ) : (
    <div className="w-full flex flex-row bg-transparent p-0">
      <div className="flex-1 bg-transparent"></div>
      <Card className="py-2 px-4 w-fit text-sm w-prose max-w-full text-wrap break-words bg-primary text-white">
        {message}
      </Card>
    </div>
  );
};
