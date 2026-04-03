import React, { useId } from "react";

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
    label: string;
    id?: string;
    type?: string;
};

export const TextField = ({ label, id: idProp, placeholder = " ", required, type, ...inputProps }: TextFieldProps) => {
    const id = idProp ?? useId();

    return (
        <div className="glitch-input-wrapper">
            <div className="input-container">
                <input
                    id={id}
                    type={type}
                    className="holo-input"
                    placeholder={placeholder}
                    required={required}
                    {...inputProps}
                />
                <label htmlFor={id} className="input-label" data-text={label}>
                    {label}
                </label>
                {/*<div className="input-border"></div>
                <div className="input-corners">
                    <div className="corner corner-tl"></div>
                    <div className="corner corner-tr"></div>
                    <div className="corner corner-bl"></div>
                    <div className="corner corner-br"></div>
                </div>*/}
            </div>
        </div>
    );
};
