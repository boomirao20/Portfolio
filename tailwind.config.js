/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#0A0F1C',
                'secondary': '#111827',
                'accent-blue': '#3B82F6',
                'accent-violet': '#8B5CF6',
                'accent-cyan': '#06B6D4',
            },
            fontFamily: {
                'heading': ['Poppins', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px #3B82F6, 0 0 10px #3B82F6' },
                    '100%': { boxShadow: '0 0 20px #8B5CF6, 0 0 30px #8B5CF6' },
                },
            },
        },
    },
    plugins: [],
}
