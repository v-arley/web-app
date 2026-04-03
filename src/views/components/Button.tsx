import "./Button.css";

interface props {
    type: "primary" | "secondary" | "danger";
    text: string;
    onClick: () => void;
}

export function Button({ type, text, onClick }: props) {
    const buttonClass = `btn btn-${type}`;

    return (
        <button className={buttonClass} onClick={onClick}>
            {text}
        </button>
    );
}