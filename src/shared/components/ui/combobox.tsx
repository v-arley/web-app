import * as React from "react";
import { Select } from "radix-ui";
import { ChevronDown, Check } from "lucide-react";

type ComboboxFloatProps = {
    label: string;
    value: string;
    options: readonly string[];
    readOnly?: boolean;
    onChange?: (value: string) => void;
};

export function ComboboxFloat({
    label,
    value,
    options,
    readOnly = false,
    onChange,
}: ComboboxFloatProps) {
    const [open, setOpen] = React.useState(false);
    const hasValue = value !== "";

    return (
        <div
            className={`nebula-input font-ibmplex tracking-[0.2em] ${hasValue || open ? "has-value" : ""}`}
        >
            {readOnly ? (
                <input className="input" placeholder=" " value={value} readOnly />
            ) : (
                <Select.Root
                    value={value}
                    onValueChange={onChange}
                    open={open}
                    onOpenChange={setOpen}
                >
                    <Select.Trigger
                        className="input w-full flex items-center justify-between cursor-pointer"
                        style={{ paddingBottom: "7px" }}
                        aria-label={label}
                    >
                        <Select.Value placeholder=" " />
                        <Select.Icon>
                            <ChevronDown
                                size={14}
                                style={{
                                    transition: "transform 0.2s",
                                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                                }}
                            />
                        </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Content
                            position="popper"
                            sideOffset={2}
                            style={{ zIndex: 9999, width: "var(--radix-select-trigger-width)" }}
                            className="overflow-hidden bg-bg-primary border border-border-default shadow-lg"
                        >
                            <Select.Viewport>
                                {options.map((opt) => (
                                    <Select.Item
                                        key={opt}
                                        value={opt}
                                        className="relative flex items-center justify-between px-4 py-2 text-[11px] font-mono font-bold tracking-[0.15em] uppercase text-txt-secondary cursor-pointer select-none
                                            data-[highlighted]:bg-accent data-[highlighted]:text-accent-fg
                                            data-[state=checked]:text-accent
                                            outline-none"
                                    >
                                        <Select.ItemText>{opt}</Select.ItemText>
                                        <Select.ItemIndicator>
                                            <Check size={11} />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                ))}
                            </Select.Viewport>
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
            )}

            <label className="user-label">{label}</label>
        </div>
    );
}
