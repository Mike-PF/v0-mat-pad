/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				"login-bg": "url('/src/images/login-bg.png')",
			},
			transitionProperty: {
				width: "width",
			},
			colors: {
				primary: { 500: "#121051" },
				secondary: { 500: "#36454f" },
				dashItem: { 100: "#121051" },
			},
			gridTemplateColumns: {
				formPage: "minmax(260px,max-content) minmax(720px,1fr)",
			},
		},
	},
	plugins: [],
};
