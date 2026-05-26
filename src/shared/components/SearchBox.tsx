import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

export default function SearchBox() {
    const [text, setText] = useState("");
    const debouncedText = useDebounce(text, 700);

    useEffect(() => {
        if (debouncedText) {
            console.log("Buscar:", debouncedText);
        }
    }, [debouncedText]);

    return (
        <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Buscar usuario"
        />
    );
}