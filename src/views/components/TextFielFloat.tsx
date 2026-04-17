import React, { useId } from 'react';
import './TextFielFloat.css';

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
    label: string;
    id?: string;
    type?: string;
};

export const TextFieldFloat = ({ label, id: idProp, placeholder = " ", required, type, value, ...inputProps }: TextFieldProps & { value?: string | number }) => {
    const id = idProp ?? useId();
    const hasValue = value !== undefined && value !== null && value !== "";

    return (
        <div className={`nebula-input font-ibmplex tracking-[0.2em] ${hasValue ? 'has-value' : ''}`}>
            <input
                    id={id}
                    type={type}
                    className="input"
                    placeholder={placeholder}
                    required={required}
                    value={value}
                    {...inputProps}
                />
            <label className="user-label">{label}</label>
        </div>
    );
};