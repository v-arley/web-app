
import "./Label.css";

interface LabelProps {
    id?: string;
    text: string;
    element: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Label({ id, text, element }: LabelProps) {
    const Element = element;
    const labelClass = `label label-${element}`;

    return <Element id={id} className={labelClass}>{text}</Element>;
}