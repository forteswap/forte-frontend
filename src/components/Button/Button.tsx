import React from "react";
import type { ButtonType } from './Button.types';
import { ButtonVariantsEnum, ButtonSizesEnum } from "./Button.types";

const Button = ({className, ...rest }: ButtonType) => {
    const { type = "button", disabled, label, size = 'default', variant = 'primary', onClick } = rest

    const ButtonVariantsMap: {[key in keyof typeof ButtonVariantsEnum as string]: string} = {
        primary: 'tw-text-white tw-bg-skin-primary-background hover:tw-bg-skin-primary-hover focus:tw-ring-skin-primary-focus focus:tw-ring-offset-skin-offset',
        secondary: 'tw-text-skin-secondary-color tw-bg-skin-secondary-background hover:tw-bg-skin-secondary-hover focus:tw-ring-skin-secondary-focus focus:tw-ring-offset-skin-offset',
    };

    const ButtonSizesMap: {[key in keyof typeof ButtonSizesEnum as string]: string} = {
        default: 'tw-px-4',
        small: 'tw-px-3 tw-text-sm tw-leading-4',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${ButtonVariantsMap[variant]} ${ButtonSizesMap[size]} tw-inline-flex tw-py-1.5 tw-items-center tw-font-bold tw-relative tw-rounded-full tw-border tw-border-transparent tw-font-medium tw-shadow-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2`}
        >
            {label}
        </button>
    )
};

export default Button;