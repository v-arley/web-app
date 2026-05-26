import React, { useId } from 'react';
import styles from './TextFielFloat.module.css';

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
    label: string;
    id?: string;
    type?: string;
};

export const TextFieldFloat = ({ label, id: idProp, placeholder = " ", required, type, value, ...inputProps }: TextFieldProps & { value?: string | number }) => {
    const id = idProp ?? useId();
    const hasValue = value !== undefined && value !== null && value !== "";
    const wrapperClassName = `${styles.wrapper} font-ibmplex tracking-wide ${hasValue ? styles.hasValue : ""}`;

    return (
        <div className={wrapperClassName}>
            <input
                    id={id}
                    type={type}
                    className={styles.input}
                    placeholder={placeholder}
                    required={required}
                    value={value}
                    {...inputProps}
                />
            <label className={styles.label}>{label}</label>
        </div>
    );
};