import { useFile } from "@/hooks/use-file";
import { UserService } from "@/lib/api/api";
import { useAuthContext } from "@/lib/ctx-auth";
import { useCallback, useEffect } from "react";
import { Avatar } from "../ui/avatar";

/**
 * A profile picture of a given user.
 * Accessible only to employers.
 *
 * @component
 */
export const Pfp = ({
  user_id,
  size = 10,
}: {
  user_id: string;
  size?: number;
}) => {
  const fetcher = useCallback(
    async () => UserService.get_user_pfp_url(user_id),
    [user_id]
  );
  const { url, sync } = useFile({
    route: "/users/" + user_id + "/pic",
    fetcher: fetcher,
  });

  useEffect(() => {
    sync();
  }, []);

  return (
    <div className={`w-${size} h-${size} rounded-full overflow-hidden`}>
      <img src={url}></img>
    </div>
  );
};

/**
 * A profile picture of a given user.
 * Accessible only to owners of pfp.
 *
 * @component
 */
export const MyPfp = ({ size = 10 }: { size?: number }) => {
  const fetcher = async () => UserService.get_my_pfp_url();
  const { url, sync } = useFile({
    route: "/users/me/pic",
    fetcher: fetcher,
  });

  useEffect(() => {
    sync();
  }, []);

  return (
    <Avatar className={`w-${size} h-${size} rounded-full overflow-hidden`}>
      <img src={url}></img>
    </Avatar>
  );
};
