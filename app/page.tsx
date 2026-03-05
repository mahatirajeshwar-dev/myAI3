"use client";

<<<<<<< HEAD
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
=======
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Loader2, Plus, Square } from "lucide-react";
import { MessageWall } from "@/components/messages/message-wall";
import { ChatHeader } from "@/app/parts/chat-header";
import { ChatHeaderBlock } from "@/app/parts/chat-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DefaultChatTransport, UIMessage } from "ai";
import { useEffect, useState, useRef } from "react";
import { AI_NAME, CLEAR_CHAT_TEXT, OWNER_NAME, WELCOME_MESSAGE } from "@/config";
import Image from "next/image";
import Link from "next/link";
import { UploadPanel } from "@/components/ingestion/upload-panel";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty.").max(2000, "Message must be at most 2000 characters."),
});

const authSchema = z.object({
  employeeId: z.string().min(2, "Employee ID is required."),
  employeeName: z.string().optional(),
});

const STORAGE_KEY = 'chat-messages';
const TOKEN_KEY = 'employee-jwt';

type StorageData = {
  messages: UIMessage[];
  durations: Record<string, number>;
};

const loadMessagesFromStorage = (): { messages: UIMessage[]; durations: Record<string, number> } => {
  if (typeof window === 'undefined') return { messages: [], durations: {} };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { messages: [], durations: {} };

    const parsed = JSON.parse(stored);
    return {
      messages: parsed.messages || [],
      durations: parsed.durations || {},
    };
  } catch {
    return { messages: [], durations: {} };
  }
};

const saveMessagesToStorage = (messages: UIMessage[], durations: Record<string, number>) => {
  if (typeof window === 'undefined') return;
  const data: StorageData = { messages, durations };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default function Chat() {
  const [durations, setDurations] = useState<Record<string, number>>(() => loadMessagesFromStorage().durations);
  const [token, setToken] = useState(() => (typeof window === 'undefined' ? '' : localStorage.getItem(TOKEN_KEY) ?? ''));
  const welcomeMessageShownRef = useRef<boolean>(false);

  const [initialMessages] = useState<UIMessage[]>(() => loadMessagesFromStorage().messages);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      headers: () => token ? { authorization: `Bearer ${token}` } : ({ } as Record<string, string>),
    }),
    onError: (error) => {
      toast.error(error.message || 'Request failed. Please login again.');
    },
  });


  useEffect(() => {
    saveMessagesToStorage(messages, durations);
  }, [durations, messages]);

  const handleDurationChange = (key: string, duration: number) => {
    setDurations((prevDurations) => ({ ...prevDurations, [key]: duration }));
  };

  useEffect(() => {
    if (initialMessages.length === 0 && !welcomeMessageShownRef.current) {
      const welcomeMessage: UIMessage = {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: WELCOME_MESSAGE }],
      };
      setMessages([welcomeMessage]);
      saveMessagesToStorage([welcomeMessage], {});
      welcomeMessageShownRef.current = true;
    }
  }, [initialMessages.length, setMessages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const authForm = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: { employeeId: "", employeeName: "" },
  });

  async function handleLogin(data: z.infer<typeof authSchema>) {
    try {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Failed to create login token');
      }

      const payload = await response.json();
      setToken(payload.token);
      localStorage.setItem(TOKEN_KEY, payload.token);
      toast.success('Employee session started');
      authForm.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error('Please login with employee ID to start chatting.');
      return;
    }
    sendMessage({ text: data.message });
    form.reset();
  }

  function clearChat() {
    const newMessages: UIMessage[] = [];
    const newDurations = {};
    setMessages(newMessages);
    setDurations(newDurations);
    saveMessagesToStorage(newMessages, newDurations);
    toast.success("Chat cleared");
  }

  return (
    <div className="flex h-screen items-center justify-center font-sans dark:bg-black">
      <main className="w-full dark:bg-black h-screen relative">
        <div className="fixed top-0 left-0 right-0 z-50 bg-linear-to-b from-background via-background/50 to-transparent dark:bg-black overflow-visible pb-16">
          <div className="relative overflow-visible">
            <ChatHeader>
              <ChatHeaderBlock>
                {!token ? (
                  <form className="flex gap-2" onSubmit={authForm.handleSubmit(handleLogin)}>
                    <Input {...authForm.register('employeeId')} placeholder="Employee ID" className="h-9 w-36" />
                    <Input {...authForm.register('employeeName')} placeholder="Name (optional)" className="h-9 w-40" />
                    <Button type="submit" size="sm">Login</Button>
                  </form>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => { setToken(''); localStorage.removeItem(TOKEN_KEY); }}>
                    Logout
                  </Button>
                )}
              </ChatHeaderBlock>
              <ChatHeaderBlock className="justify-center items-center">
                <Avatar className="size-8 ring-1 ring-primary">
                  <AvatarImage src="/logo.png" />
                  <AvatarFallback>
                    <Image src="/logo.png" alt="Logo" width={36} height={36} />
                  </AvatarFallback>
                </Avatar>
                <p className="tracking-tight">Chat with {AI_NAME}</p>
              </ChatHeaderBlock>
              <ChatHeaderBlock className="justify-end">
                <Button variant="outline" size="sm" className="cursor-pointer" onClick={clearChat}>
                  <Plus className="size-4" />
                  {CLEAR_CHAT_TEXT}
                </Button>
              </ChatHeaderBlock>
            </ChatHeader>
          </div>
        </div>
        <div className="h-screen overflow-y-auto px-5 py-4 w-full pt-[88px] pb-[150px]">
          <div className="flex flex-col items-center justify-end min-h-full">
            {token && <UploadPanel token={token} />}
            <>
                <MessageWall messages={messages} status={status} durations={durations} onDurationChange={handleDurationChange} />
                {status === "submitted" && (
                  <div className="flex justify-start max-w-3xl w-full">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </div>
                )}
</>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-linear-to-t from-background via-background/50 to-transparent dark:bg-black overflow-visible pt-13">
          <div className="w-full px-5 pt-5 pb-1 items-center flex justify-center relative overflow-visible">
            <div className="message-fade-overlay" />
            <div className="max-w-3xl w-full">
              <form id="chat-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="chat-form-message" className="sr-only">Message</FieldLabel>
                        <div className="relative h-13">
                          <Input
                            {...field}
                            id="chat-form-message"
                            className="h-15 pr-15 pl-5 bg-card rounded-[20px]"
                            placeholder="Ask A.I.R.A. about HR/IT/Admin policies..."
                            disabled={status === "streaming"}
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                              }
                            }}
                          />
                          {(status == "ready" || status == "error") && (
                            <Button className="absolute right-3 top-3 rounded-full" type="submit" disabled={!field.value.trim()} size="icon">
                              <ArrowUp className="size-4" />
                            </Button>
                          )}
                          {(status == "streaming" || status == "submitted") && (
                            <Button className="absolute right-2 top-2 rounded-full" size="icon" onClick={() => stop()}>
                              <Square className="size-4" />
                            </Button>
                          )}
                        </div>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </div>
          </div>
          <div className="w-full px-5 py-3 items-center flex justify-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {OWNER_NAME}&nbsp;<Link href="/terms" className="underline">Terms of Use</Link>
          </div>
        </div>
      </main>
    </div>
  );
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
}
