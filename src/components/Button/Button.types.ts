import type { ButtonHTMLAttributes } from 'react';
import { z } from "zod";

export const ButtonVariantsEnum = z.enum(["primary", "secondary"]);
export const ButtonSizesEnum = z.enum(["small", "default"]);

const ButtonProps = z.object({
    className: z.string().optional(),
    disabled: z.boolean().optional(),
    label: z.string(),
    size: ButtonSizesEnum.optional(),
    variant: ButtonVariantsEnum.optional(),
    onClick: z.function(),
})

export type ButtonType = z.extendShape<ButtonHTMLAttributes<HTMLButtonElement>, z.infer<typeof ButtonProps>>
export type ButtonVariantsType = z.infer<typeof ButtonVariantsEnum>;
