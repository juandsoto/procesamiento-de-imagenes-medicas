/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: '#1f2a38',
				secondary: '#1b2531'
			}
		},
	},
	plugins: [],
}

