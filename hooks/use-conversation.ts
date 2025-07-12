/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-07-11 17:06:17
 * @ Modified time: 2025-07-12 19:47:30
 * @ Description:
 *
 * Used by student users for managing conversation state.
 */

import { authPocketbase } from "@/lib/pocketbase";
import { useEffect, useState } from "react";

interface Message {
  sender_id: string;
  message: string;
  timestamp: string;
}

/**
 * Allows to manage conversation state.
 *
 * @hook
 * @param conversationId
 */
export const useConversation = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    if (!conversationId || !conversationId.trim().length)
      return () => unsubscribe();

    authPocketbase()
      .then((r) => (console.log("success"), r))
      .then(async () => {
        // ! dont forget to define unsubscribe here
      });

    return () => unsubscribe();
  }, [conversationId]);

  return {
    messages,
    loading,
  };
};
