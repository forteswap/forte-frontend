/** @type {import('tailwindcss').Config} */
module.exports = {
    /*@todo v0 pre bootstrap prefix (delete prefix and convert all classnames when we move away from bootstrap entirely)*/
    prefix: 'tw-',
    content: ['./src/**/*.{js,tsx}', './src/index.html'],
    theme: {
        extend: {
            textColor: {
                skin: {
                    secondary: {
                        color: 'hsl(var(--color-secondary) / <alpha-value>)',
                    }
                }
            },
            backgroundColor: {
                skin: {
                    primary: {
                        background: 'hsl(var(--color-primary-background) / <alpha-value>)',
                        hover: 'hsl(var(--color-primary-hover) / <alpha-value>)',
                    },
                    secondary: {
                        background: 'hsl(var(--color-secondary-background) / <alpha-value>)',
                        hover: 'hsl(var(--color-secondary-hover) / <alpha-value>)',
                    }
                }
            },
            ringColor: {
                skin: {
                    primary: {
                        focus: 'hsl(var(--color-primary-background) / <alpha-value>)',
                    },
                    secondary: {
                        focus: 'hsl(var(--color-secondary-background) / <alpha-value>)',
                    }
                }
            },
            ringOffsetColor: {
              skin: {
                  offset: 'hsl(var(--color-base) / <alpha-value>)',
              }
            },
            gradientColorStops: {
                skin: {
                    hue: 'hsl(var(--color-fill) / <alpha-value>)',
                }
            }
        },
    },
    plugins: [],
    /*@todo v0 pre bootstrap (use preflight from tailwind when we move away from bootstrap entirely)*/
    corePlugins: {
        // preflight: false,
    },
};