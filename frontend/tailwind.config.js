/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {

    extend: {
      height: {
        'bannerHeight': '550px'
      },
      colors: {
        'cyan': ' #00FFFF',
        'violet': '#EE82EE',
        'primary': '#3498db',
      },
    },
  },
  daisyui: {
    darkTheme: "white", // name of one of the included themes for dark mode

  },
  plugins: [require("daisyui")],
}

