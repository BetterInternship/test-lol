// firebaseClient.ts
import { APIClient, APIRoute } from "./api/api-client";
import PocketBase, { AuthRecord } from "pocketbase";

export const pb = new PocketBase(process.env.NEXT_PUBLIC_CHAT_URL as string);

/**
 * Custom login using our own federated tokens.
 *
 * @returns
 */
export const authPocketbase = async () => {
  // No need to redo auth if valid
  if (pb.authStore.isValid) return;

  // Request token
  const { token, user } = await APIClient.post<{
    token: string;
    user: AuthRecord;
  }>(APIRoute("conversations").r("auth").build());
  pb.authStore.save(token, user);
};
