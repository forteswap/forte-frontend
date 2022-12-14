import React from 'react'
// @todo implement project aliases
import { escapeRegExp } from '../../utils'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const Input = React.memo(function InnerInput({
    value,
    onUserInput,
    placeholder,
    prependSymbol,
    ...rest
}: {
    value: string | number
    onUserInput: (input: string) => void
    error?: boolean
    fontSize?: string
    align?: 'right' | 'left'
    prependSymbol?: string | undefined
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
    const enforcer = (nextUserInput: string) => {
        if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
            onUserInput(nextUserInput)
        }
    }

    // @todo add styles after tailwind implementation
    return (
        <input
            {...rest}
            value={prependSymbol && value ? prependSymbol + value : value}
            onChange={(event) => {
                if (prependSymbol) {
                    const value = event.target.value

                    // cut off prepended symbol
                    const formattedValue = value.toString().includes(prependSymbol)
                        ? value.toString().slice(1, value.toString().length + 1)
                        : value

                    // replace commas with periods, because uniswap exclusively uses period as the decimal separator
                    enforcer(formattedValue.replace(/,/g, '.'))
                } else {
                    enforcer(event.target.value.replace(/,/g, '.'))
                }
            }}
            // universal input options
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            // text-specific options
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder={placeholder || '0'}
            minLength={1}
            maxLength={79}
            spellCheck="false"
        />
    )
})

export default Input

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group