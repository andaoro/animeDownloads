/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'default':"#1a1a1a",
        'principal':"#ff9900",
        'Rsecondary':"#0099ff",
        'Tdefault':"#ffffff",
        'Tsecondary':"#b3b3b3",
        'navbar':"#262626",
        'Bprincipal':"#ff9900",
        'Bsecondary':"#0099ff"
      }
    },
  },
  plugins: [],
}