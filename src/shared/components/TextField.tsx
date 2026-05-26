import React, { useId } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
    label: string;
    id?: string;
    type?: string;
};

export const TextField = ({ label, id: idProp, placeholder = " ", required, type, ...inputProps }: TextFieldProps) => {
    const id = idProp ?? useId();

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <input
                    id={id}
                    type={type}
                    className={styles.input}
                    placeholder={placeholder}
                    required={required}
                    {...inputProps}
                />
                <label htmlFor={id} className={styles.label} data-text={label}>
                    {label}
                </label>
                <div className={styles.border}></div>
                <div className={styles.corners}>
                    <div className={`${styles.corner} ${styles.cornerTl}`}></div>
                    <div className={`${styles.corner} ${styles.cornerTr}`}></div>
                    <div className={`${styles.corner} ${styles.cornerBl}`}></div>
                    <div className={`${styles.corner} ${styles.cornerBr}`}></div>
                </div>
            </div>
        </div>
    );
};
