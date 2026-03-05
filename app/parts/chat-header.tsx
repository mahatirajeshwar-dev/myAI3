import { cn } from "@/lib/utils";

export function ChatHeaderBlock({ children, className }: { children?: React.ReactNode, className?: string }) {
    return (
        <div className={cn("gap-2 flex flex-1", className)}>
            {children}
        </div>
    )
}

export function ChatHeader({ children }: { children: React.ReactNode }) {
    return (
<<<<<<< HEAD
        <div className="w-full flex py-4 px-6 bg-transparent items-center">
=======
        <div className="w-full flex py-5 px-5 bg-linear-to-b from-background to-transparent">
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
            {children}
        </div>
    )
}