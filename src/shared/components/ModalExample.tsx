import { useToggle } from "../hooks/useToggle";

export default function ModalExample() {
    const { value: open, toggle, disable } = useToggle(false);

    return (
        <>
            <button onClick={toggle}>Abrir modal</button>

            {open && (
                <div>
                    <h2>Ventana modal</h2>
                    <button onClick={disable}>Cerrar</button>
                </div>
            )}
        </>
    );
}