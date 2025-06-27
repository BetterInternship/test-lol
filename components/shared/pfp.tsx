import { useFile } from "@/hooks/use-file";
import { user_service } from "@/lib/api/api";
import { useCallback, useEffect } from "react";

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
    async () => user_service.get_user_pfp_url(user_id),
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
