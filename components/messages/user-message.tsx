import { UIMessage } from "ai";
import { Response } from "@/components/ai-elements/response";

export function UserMessage({ message }: { message: UIMessage }) {
    return (
<<<<<<< HEAD
        <div className="whitespace-pre-wrap w-full flex justify-end mb-2">
            <div className="user-message-bubble">
                <div className="text-sm font-medium leading-relaxed">
=======
        <div className="whitespace-pre-wrap w-full flex justify-end">
            <div className="max-w-lg w-fit px-4 py-3 rounded-[20px] bg-neutral-100">
                <div className="text-sm">
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
                    {message.parts.map((part, i) => {
                        switch (part.type) {
                            case "text":
                                return <Response key={`${message.id}-${i}`}>{part.text}</Response>;
                        }
                    })}
                </div>
            </div>
        </div>
    )
}