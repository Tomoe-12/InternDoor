/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {

    extend: {
      rounded: {
        '3xl': '100px'
      },
      height: {
        'height5px' :'500px',
        'width35px' :'350px',
      },
     
      colors: {
        'cyan': ' #00FFFF',
        'violet': '#EE82EE',
        'kindablack' : '#3f3d56',
        'primary': '#3498db',
      },
      borderRadius: {
        '3xl' :'100px'
      }
    },
  },
  daisyui: {
    darkTheme: "white", // name of one of the included themes for dark mode

  },
  plugins: [require("daisyui")],
}

