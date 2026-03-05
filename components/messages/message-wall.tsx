import { UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";


export function MessageWall({ messages, status, durations, onDurationChange }: { messages: UIMessage[]; status?: string; durations?: Record<string, number>; onDurationChange?: (key: string, duration: number) => void }) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="relative max-w-3xl w-full">
            <div className="relative flex flex-col gap-4">
                {messages.map((message, messageIndex) => {
                    const isLastMessage = messageIndex === messages.length - 1;
                    return (
                        <div key={message.id} className="w-full">
                            {message.role === "user" ? <UserMessage message={message} /> : <AssistantMessage message={message} status={status} isLastMessage={isLastMessage} durations={durations} onDurationChange={onDurationChange} />}
                        </div>
                    );
                })}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}