module.exports = {
    content: ['./src/**/*.{js,tsx}', './src/index.html'],
    theme: {
        extend: {

        },
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
};