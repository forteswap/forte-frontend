/** @type {import('tailwindcss').Config} */
module.exports = {
    /*@todo v0 pre bootstrap prefix (delete prefix and convert all classnames when we move away from bootstrap entirely)*/
    prefix: 'tw-',
    content: ['./src/**/*.{js,tsx}', './src/index.html'],
    theme: {
        extend: {},
    },
    plugins: [],
    /*@todo v0 pre bootstrap (use preflight from tailwind when we move away from bootstrap entirely)*/
    corePlugins: {
        preflight: false,
    },
};