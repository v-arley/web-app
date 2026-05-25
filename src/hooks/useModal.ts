import { useState } from "react";

// const { open, show, hide } = useModal();

export function useModal() {
    const [open, setOpen] = useState(false);

    return {
        open,
        show: () => setOpen(true),
        hide: () => setOpen(false)
    };
}