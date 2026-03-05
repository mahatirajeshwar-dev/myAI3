import { ReasoningUIPart } from "ai";
import { Reasoning } from "../ai-elements/reasoning";
import { ReasoningTrigger } from "../ai-elements/reasoning";
import { ReasoningContent } from "../ai-elements/reasoning";

export function ReasoningPart({ part, isStreaming = false, duration, onDurationChange }: { part: ReasoningUIPart; isStreaming?: boolean; duration?: number; onDurationChange?: (duration: number) => void }) {
    return <Reasoning isStreaming={isStreaming} duration={duration} onReasoningDurationChange={onDurationChange} className="mb-0">
        <ReasoningTrigger />
        {part.text && <ReasoningContent>
            {part.text}
        </ReasoningContent>}
    </Reasoning>;
}