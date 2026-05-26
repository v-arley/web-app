import { useState } from "react";

// const { values, handleChange, reset } = useForm({
//   name: "",
//   email: ""
// });

export function useForm(initialValues) {
    const [values, setValues] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const reset = () => setValues(initialValues);

    return { values, handleChange, reset };
}