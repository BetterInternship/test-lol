"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConversations } from "@/lib/api/student.api";
import { useAuthContext } from "@/lib/ctx-auth";
import { Card } from "@/components/ui/our-card";
import { Conversation } from "../../../lib/db/db.types";
import { EmployerPfp } from "@/components/shared/pfp";
import { Divider } from "@/components/ui/divider";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/lib/ctx-app";

export default function ConversationsPage() {
  const { isAuthenticated, redirectIfNotLoggedIn } = useAuthContext();
  const { isMobile } = useAppContext();
  // const conversations = useConversations();
  const conversations: {
    data: Conversation[];
  } = {
    data: [
      // {
      //   id: "1",
      //   user_id: "lol",
      //   employer_id: "3d8d8a5f-9cd5-4606-bc0e-27aee989e986",
      //   employer: {
      //     name: "ABowei Corp.",
      //   },
      //   created_at: "",
      // },
      // {
      //   id: "1",
      //   user_id: "lol",
      //   employer_id: "3d8d8a5f-9cd5-4606-bc0e-27aee989e986",
      //   employer: {
      //     name: "ABowei Corp.",
      //   },
      //   created_at: "",
      // },
      // {
      //   id: "1",
      //   user_id: "lol",
      //   employer_id: "3d8d8a5f-9cd5-4606-bc0e-27aee989e986",
      //   employer: {
      //     name: "ABowei Corp.",
      //   },
      //   created_at: "",
      // },
      // {
      //   id: "1",
      //   user_id: "lol",
      //   employer_id: "3d8d8a5f-9cd5-4606-bc0e-27aee989e986",
      //   employer: {
      //     name: "ABowei Corp.",
      //   },
      //   created_at: "",
      // },
      // {
      //   id: "1",
      //   user_id: "lol",
      //   employer_id: "3d8d8a5f-9cd5-4606-bc0e-27aee989e986",
      //   employer: {
      //     name: "ABowei Corp.",
      //   },
      //   created_at: "",
      // },
      // {
      //   id: "1",
      //   user_id: "lol",
      //   employer_id: "3d8d8a5f-9cd5-4606-bc0e-27aee989e986",
      //   employer: {
      //     name: "ABowei Corp.",
      //   },
      //   created_at: "",
      // },
      // {
      //   id: "1",
      //   user_id: "lol",
      //   employer_id: "3d8d8a5f-9cd5-4606-bc0e-27aee989e986",
      //   employer: {
      //     name: "ABowei Corp.",
      //   },
      //   created_at: "",
      // },
    ],
  };

  redirectIfNotLoggedIn();

  return (
    <div className="w-full h-full flex flex-row">
      {conversations.data?.length ? (
        <div className="relative w-full animate-fade-in h-full">
          {/* Side Panel */}
          <div className="absolute w-[25%] border-r border-r-gray-300 h-full max-h-full overflow-y-auto">
            <div className="flex flex-col gap-0">
              {conversations.data?.map((conversation) => (
                <ConversationCard conversation={conversation} />
              ))}
            </div>
          </div>
          {/* Conversation Pane */}
          <div></div>
        </div>
      ) : (
        <div className="relative w-full flex items-center animate-fade-in h-full">
          <div className="flex flex-col items-center h-fit w-1/3 mx-auto pb-32">
            <div className="opacity-35 mb-10">
              <div className="flex flex-row justify-center w-full">
                <h1
                  className={cn(
                    "block font-heading font-bold",
                    isMobile ? "text-5xl" : "text-6xl"
                  )}
                >
                  BetterInternship
                </h1>
              </div>
              <br />
              <div className="flex flex-row justify-center w-full">
                <p className="block text-2xl tracking-tight">
                  Better Internships Start Here
                </p>
              </div>
            </div>
            <div
              className={cn(
                "text-center border border-primary border-opacity-50 text-primary shadow-sm rounded-[0.33em] opacity-85 p-4 bg-white",
                isMobile ? "min-w-full" : "min-w-prose"
              )}
            >
              You currently don't have any conversations.
            </div>
          </div>
        </div>
      )}
      <hr />
      <br />
    </div>
  );
}

export const ConversationCard = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  return (
    <Card className="rounded-none border-l-0 border-r-0 border-b-0 last:border-b py-2 px-8 hover:bg-gray-100 hover:cursor-pointer">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <EmployerPfp employer_id={conversation.employer_id} />
          <div className="flex flex-col">
            <span className="font-medium">{conversation.employer?.name}</span>
            <span className="text-xs opacity-60">{"Subtitle here"}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 opacity-50" />
      </div>
    </Card>
  );
};
