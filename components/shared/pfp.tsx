import { useFile } from "@/hooks/use-file";
import { UserService } from "@/lib/api/api";
import { useAuthContext } from "@/lib/ctx-auth";
import { useCallback, useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useProfile } from "@/lib/api/use-api";

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
    <Avatar className={`w-${size} h-${size} rounded-full overflow-hidden`}>
      {url ? (
        <img src={url}></img>
      ) : (
        <AvatarFallback className="text-base sm:text-lg font-semibold">
          "?"
        </AvatarFallback>
      )}
    </Avatar>
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
  const { profile } = useProfile();
  const { url, sync } = useFile({
    route: "/users/me/pic",
    fetcher: fetcher,
  });

  useEffect(() => {
    sync();
  }, []);

  return (
    <Avatar className={`w-${size} h-${size} rounded-full overflow-hidden`}>
      {profile?.profile_picture ? (
        <img src={url}></img>
      ) : (
        <AvatarFallback className="text-base sm:text-lg font-semibold">
          {profile?.first_name?.[0]?.toUpperCase()}
          {profile?.last_name?.[0]?.toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>
  );
};
