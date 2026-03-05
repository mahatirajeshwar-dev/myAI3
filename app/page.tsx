"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ChatInterface = dynamic(() => import("@/components/chat/chat-interface"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center dark:bg-black overflow-hidden">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  ),
});

export default function Chat() {
  return <ChatInterface />;
}
