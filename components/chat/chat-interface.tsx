"use client";

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
import { useEffect, useState, useRef, useMemo } from "react";
import { AI_NAME, CLEAR_CHAT_TEXT, OWNER_NAME, WELCOME_MESSAGE } from "@/config";
import Image from "next/image";
import Link from "next/link";
import { UploadPanel } from "@/components/ingestion/upload-panel";

const STORAGE_KEY = 'abis_chat_messages';
const TOKEN_KEY = 'employee_token';
const HISTORY_KEY = 'abis_chat_history';

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

const formSchema = z.object({
    message: z.string().min(1, "Message cannot be empty"),
});
// ... (authSchema and StoredData remain same)
const authSchema = z.object({
    employeeId: z.string().min(1, "Employee ID is required"),
    employeeName: z.string().min(1, "Name is required"),
});

type StoredData = {
    messages: UIMessage[];
    durations: Record<string, number>;
};

type HistoryItem = {
    id: string;
    employeeId: string;
    timestamp: number;
    title: string;
    data: StoredData;
};

const loadMessagesFromStorage = (): StoredData => {
    if (typeof window === 'undefined') return { messages: [], durations: {} };
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { messages: [], durations: {} };
};

const saveMessagesToStorage = (messages: UIMessage[], durations: Record<string, number>) => {
    if (typeof window === 'undefined') return;
    const data: StoredData = { messages, durations };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const saveToHistory = (messages: UIMessage[], durations: Record<string, number>, employeeId: string) => {
    if (typeof window === 'undefined' || messages.length <= 1 || !employeeId) return;

    // Don't save if only welcome message
    if (messages.length === 1 && messages[0].id.startsWith('welcome')) return;

    const history: HistoryItem[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const firstUserMessage = messages.find(m => m.role === 'user')?.parts.find(p => p.type === 'text');
    const title = (firstUserMessage && 'text' in firstUserMessage ? (firstUserMessage.text as string).substring(0, 40) : 'New Chat') + '...';

    const newItem: HistoryItem = {
        id: `chat-${Date.now()}`,
        employeeId,
        timestamp: Date.now(),
        title,
        data: { messages, durations }
    };

    history.unshift(newItem);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50))); // Keep last 50
};

export default function ChatInterface() {
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [token, setToken] = useState('');
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [employeeId, setEmployeeId] = useState<string | null>(null);
    const tokenRef = useRef('');
    const welcomeMessageShownRef = useRef<boolean>(false);
    const [initialMessages] = useState<UIMessage[]>([]);

    // Load token and messages on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (storedToken) {
            setToken(storedToken);
            tokenRef.current = storedToken;
            const payload = parseJwt(storedToken);
            if (payload) {
                setUserRole(payload.role);
                setUserName(payload.name || null);
                setEmployeeId(payload.sub || null);
            }
        }

        const stored = loadMessagesFromStorage();
        if (stored.messages.length > 0) {
            setMessages(stored.messages);
            setDurations(stored.durations);
            welcomeMessageShownRef.current = true;
        } else if (!welcomeMessageShownRef.current) {
            const welcomeMessage: UIMessage = {
                id: `welcome-${Date.now()}`,
                role: "assistant",
                parts: [{ type: "text", text: WELCOME_MESSAGE }],
            };
            setMessages([welcomeMessage]);
            saveMessagesToStorage([welcomeMessage], {});
            welcomeMessageShownRef.current = true;
        }
    }, []); // Run once on mount

    // Sync ref with local state
    useEffect(() => {
        tokenRef.current = token;
        if (token) {
            const payload = parseJwt(token);
            if (payload) {
                setUserRole(payload.role);
                setUserName(payload.name || null);
                setEmployeeId(payload.sub || null);
            }
        } else {
            setUserRole(null);
            setUserName(null);
            setEmployeeId(null);
        }
    }, [token]);

    // Stable transport with reactive headers
    const transport = useMemo(() => new DefaultChatTransport({
        api: '/api/chat',
        headers: () => {
            if (!tokenRef.current) return {} as Record<string, string>;
            // Use lowercase 'authorization' for standard compatibility
            return { 'authorization': `Bearer ${tokenRef.current}` } as Record<string, string>;
        },
    }), []);

    const { messages, sendMessage, status, stop, setMessages } = useChat({
        messages: initialMessages,
        transport,
        onError: (error) => {
            const errorMsg = error.message || '';
            if (errorMsg.includes('bearer token') || errorMsg.includes('401') || errorMsg.includes('Invalid or expired token')) {
                toast.error('Session expired or invalid. Please login again.');
                handleLogout(); // Clear the invalid token
            } else {
                toast.error(errorMsg || 'Request failed. Please try again.');
            }
        },
    });

    useEffect(() => {
        saveMessagesToStorage(messages, durations);
    }, [durations, messages]);

    const handleDurationChange = (key: string, duration: number) => {
        setDurations((prevDurations) => ({ ...prevDurations, [key]: duration }));
    };

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

            const { token: newToken } = await response.json() as { token: string };
            setToken(newToken);
            tokenRef.current = newToken;
            localStorage.setItem(TOKEN_KEY, newToken);

            const loginPayload = parseJwt(newToken);
            if (loginPayload) {
                setUserRole(loginPayload.role);
                setUserName(loginPayload.name || null);
                setEmployeeId(loginPayload.sub || null);
            }

            toast.success('Employee session started successfully.');

            // Add personalized greeting to chat
            const greetingName = loginPayload?.name || data.employeeName || 'Employee';
            const sessionMessage: UIMessage = {
                id: `session-${Date.now()}`,
                role: "assistant",
                parts: [{ type: "text", text: `Hi ${greetingName}, how can I help you today?` }],
            };
            setMessages((prev) => [...prev, sessionMessage]);

            authForm.reset();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Login failed');
        }
    }

    function onSubmit(data: z.infer<typeof formSchema>) {

        // Explicitly pass headers for maximum reliability
        sendMessage({ text: data.message }, {
            headers: { 'authorization': `Bearer ${tokenRef.current}` }
        });
        form.reset();
    }

    function clearChat(manual = true) {
        if (messages.length > 1 && employeeId) {
            saveToHistory(messages, durations, employeeId);
        }
        const welcomeMessage: UIMessage = {
            id: `welcome-${Date.now()}`,
            role: "assistant",
            parts: [{ type: "text", text: WELCOME_MESSAGE }],
        };
        const newMessages = [welcomeMessage];
        const newDurations = {};
        setMessages(newMessages);
        setDurations(newDurations);
        saveMessagesToStorage(newMessages, newDurations);
        if (manual) toast.success("New chat started");
    }

    const handleLogout = () => {
        // Clear chat to history if needed
        if (messages.length > 1 && employeeId) {
            saveToHistory(messages, durations, employeeId);
        }

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STORAGE_KEY);
        setToken('');
        tokenRef.current = '';
        setUserRole(null);
        setUserName(null);
        setEmployeeId(null);
        setMessages([]);
        setDurations({});
        welcomeMessageShownRef.current = false;

        toast.success("Logged out. Chat cleared.");
    };

    return (
        <div className="flex h-screen items-center justify-center font-sans">
            <main className="w-full bg-background h-screen relative transition-colors duration-500">
                <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 pb-4">
                    <div className="relative">
                        <ChatHeader>
                            <ChatHeaderBlock>
                                {!token ? (
                                    <form className="flex gap-2" onSubmit={authForm.handleSubmit(handleLogin)}>
                                        <Input {...authForm.register('employeeId')} placeholder="ID" className="h-9 w-24 rounded-full border-border/60" />
                                        <Input {...authForm.register('employeeName')} placeholder="Name" className="h-9 w-24 rounded-full border-border/60" />
                                        <Button type="submit" size="sm" className="rounded-full px-5">Login</Button>
                                    </form>
                                ) : (
                                    <div className="flex gap-2 items-center">
                                        {userName && (
                                            <span className="text-xs font-semibold px-4 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                                                Welcome, {userName}
                                            </span>
                                        )}
                                        {userRole === 'employee' && (
                                            <Button size="sm" variant={showHistory ? "default" : "outline"} className="rounded-full border-border/60" onClick={() => setShowHistory(!showHistory)}>
                                                {showHistory ? "Back" : "History"}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </ChatHeaderBlock>
                            <ChatHeaderBlock className="justify-center items-center">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-9 ring-2 ring-primary/20 bg-background premium-shadow">
                                        <AvatarImage src="/logo.png" />
                                        <AvatarFallback title="AIRA Logo">
                                            <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground font-bold text-xs uppercase">AB</div>
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm tracking-tight">{AI_NAME}</span>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-70">ABIS ASSISTANT</span>
                                    </div>
                                </div>
                            </ChatHeaderBlock>
                            <ChatHeaderBlock className="justify-end gap-2">
                                {token && (
                                    <Button size="sm" variant="ghost" className="rounded-full border border-border/60 hover:bg-muted font-semibold text-xs" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-muted rounded-full" onClick={() => clearChat(true)}>
                                    <Plus className="size-4 mr-1 text-primary" />
                                    <span className="text-xs font-semibold">{CLEAR_CHAT_TEXT}</span>
                                </Button>
                            </ChatHeaderBlock>
                        </ChatHeader>
                    </div>
                </div>
                <div className="h-screen overflow-y-auto px-5 py-4 w-full pt-[100px] pb-[160px] scroll-smooth">
                    <div className="flex flex-col items-center justify-end min-h-full max-w-4xl mx-auto">
                        {token && userRole !== 'employee' && <UploadPanel token={token} />}
                        {showHistory ? (
                            <div className="w-full bg-card/50 backdrop-blur-sm border border-border/60 rounded-3xl p-6 min-h-[500px] premium-shadow">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold tracking-tight">Recent Sessions</h2>
                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">Last 50 chats</span>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as HistoryItem[])
                                        .filter(item => item.employeeId === employeeId)
                                        .map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setMessages(item.data.messages);
                                                    setDurations(item.data.durations);
                                                    setShowHistory(false);
                                                    toast.success("Loaded chat session");
                                                }}
                                                className="w-full text-left p-4 rounded-2xl hover:bg-muted/80 border border-border/40 hover:border-primary/20 transition-all group relative overflow-hidden"
                                            >
                                                <div className="relative z-10 text-sm font-semibold truncate group-hover:text-primary transition-colors">{item.title}</div>
                                                <div className="relative z-10 text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                    {new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                                </div>
                                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ArrowUp className="size-4 rotate-45 text-primary" />
                                                </div>
                                            </button>
                                        ))}
                                    {(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as HistoryItem[]).length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/60 italic border-2 border-dashed border-border/40 rounded-3xl">
                                            <p className="text-sm">No previous conversations found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <MessageWall messages={messages} status={status} durations={durations} onDurationChange={handleDurationChange} />
                                {status === "submitted" && (
                                    <div className="flex justify-start w-full my-4">
                                        <div className="ai-message-bubble opacity-70 animate-pulse">
                                            <Loader2 className="size-4 animate-spin" />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-50 bg-linear-to-t from-background via-background/80 to-transparent pt-10">
                    <div className="w-full px-5 pb-4 flex flex-col items-center relative gap-2">
                        <div className="max-w-3xl w-full chat-input-container p-1 pt-2">
                            <form id="chat-form" onSubmit={form.handleSubmit(onSubmit)}>
                                <FieldGroup>
                                    <Controller
                                        name="message"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="chat-form-message" className="sr-only">Message</FieldLabel>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        id="chat-form-message"
                                                        className="h-14 pr-16 pl-6 bg-transparent border-none rounded-[1.8rem] focus-visible:ring-0 text-sm placeholder:text-muted-foreground/50 shadow-none"
                                                        placeholder="Ask ABIS AI about HR, IT, or Admin policies..."
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
                                                    <div className="absolute right-2 top-2">
                                                        {(status == "ready" || status == "error") && (
                                                            <Button className="size-10 rounded-full shadow-lg hover:scale-105 transition-transform" type="submit" disabled={!field.value.trim()} size="icon">
                                                                <ArrowUp className="size-5" />
                                                            </Button>
                                                        )}
                                                        {(status == "streaming" || status == "submitted") && (
                                                            <Button className="size-10 rounded-full shadow-lg" size="icon" onClick={() => stop()}>
                                                                <Square className="size-4 fill-current" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </form>
                        </div>
                        <div className="text-[10px] text-muted-foreground/60 font-medium tracking-wide uppercase">
                            © {new Date().getFullYear()} {OWNER_NAME} • <Link href="/terms" className="hover:text-primary transition-colors underline-offset-4">Legal Policy</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
}
