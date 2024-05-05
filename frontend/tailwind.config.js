/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {

    extend: {
      rounded: {
        '3xl': '100px'
      },
      height: {
        'height5px': '500px',
        'width35px': '350px',
      },

      colors: {
        'cyan': ' #00FFFF',
        'violet': '#EE82EE',
        'kindablack': '#3f3d56',
        'primary': '#3498db',
      },
      borderRadius: {
        '3xl': '100px'
      },boxShadow:{
        '3xl' : 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
      }
    },
  },
  daisyui: {
    darkTheme: "white", // name of one of the included themes for dark mode

  },
  plugins: [
    require("daisyui"),
    function ({ addUtilities}){
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar":{
          display: 'none'
        }
      }
      addUtilities(newUtilities)
    }
    
  ],
}

