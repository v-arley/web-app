import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

export type FeedbackTone = "success" | "error" | "info";

type SystemFeedbackProps = {
    tone: FeedbackTone;
    message: string;
};

const TONE_CLASS: Record<FeedbackTone, string> = {
    success: "app-alert--ok",
    error: "app-alert--error",
    info: "app-alert--info",
};

export function SystemFeedback({ tone, message }: SystemFeedbackProps) {
    const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertTriangle : Info;

    return (
        <div className={`app-alert ${TONE_CLASS[tone]}`}>
            <Icon size={14} />
            <span>{message}</span>
        </div>
    );
}

export default SystemFeedback;
