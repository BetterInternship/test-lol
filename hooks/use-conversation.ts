/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-07-11 17:06:17
 * @ Modified time: 2025-07-13 09:49:07
 * @ Description:
 *
 * Used by student users for managing conversation state.
 */

import { usePocketbase } from "@/lib/pocketbase";
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
export const useConversation = (
  type: "employer" | "user",
  conversationId?: string
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [employerId, setEmployerId] = useState("");
  const [loading, setLoading] = useState(true);
  const { pb, user } = usePocketbase(type);

  useEffect(() => {
    let unsubscribe = () => {};

    if (!user || !conversationId || !conversationId.trim().length)
      return () => unsubscribe();

    // Pull messages first
    pb.collection("conversations")
      .getOne(conversationId)
      .then((conversation) => {
        setEmployerId(conversation.employer_id);
        setMessages(conversation.contents);
      });

    // Subscribe to messages
    pb.collection("conversations")
      .subscribe(
        "*",
        function (e) {
          const conversation = e.record;
          setMessages(conversation.contents);
        },
        {
          filter: `id = '${conversationId}'`,
        }
      )
      .then((u) => (unsubscribe = u));

    return () => unsubscribe();
  }, [user, conversationId]);

  return {
    messages,
    employerId,
    loading,
  };
};

export const useConversations = (type: "user" | "employer") => {
  const { pb, user } = usePocketbase(type);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (!user) return () => unsubscribe();

    // Pull all convos first
    pb.collection("notifications")
      .getOne(user.id)
      .then((notification) => {
        const conversations = Object.keys(notification.conversations).map(
          (id) => ({
            id,
            ...notification.conversations[id],
          })
        );
        setConversations(conversations);
      });

    // Subscribe to notifications
    pb.collection("notifications")
      .subscribe(
        "*",
        function (e) {
          const notification = e.record;
          const conversations = Object.keys(notification.conversations).map(
            (id) => ({
              id,
              ...notification.conversations[id],
            })
          );
          setConversations(conversations);
        },
        {
          filter: `id = '${user.id}'`,
        }
      )
      .then((u) => (unsubscribe = u));

    return () => unsubscribe();
  }, [user]);

  return {
    data: conversations,
  };
};
