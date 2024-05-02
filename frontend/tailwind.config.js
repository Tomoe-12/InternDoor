/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {

    extend: {
      rounded: {
        '3xl': '100px'
      },
      height: {
        'bannerHeight': '100vh',
        'height5px' :'500px',
        'width35px' :'350px',
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

