import { useState } from "react";

// const { value: open, toggle } = useToggle();

export function useToggle(initial = false) {
    const [value, setValue] = useState(initial);

    const toggle = () => setValue((prev) => !prev);
    const enable = () => setValue(true);
    const disable = () => setValue(false);

    return {
        value,
        toggle,
        enable,
        disable
    };
}