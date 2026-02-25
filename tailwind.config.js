/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#f8bbd0",
                    foreground: "#ffffff",
                },
                cream: {
                    light: "#fff4e6",
                    DEFAULT: "#fde3b8",
                    dark: "#faddc2",
                }
            },
        },
    },
    plugins: [],
};
