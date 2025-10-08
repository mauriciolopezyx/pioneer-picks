/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {

      colors: {
        primary: "#d50032",
        secondary: "#000000",
        light: {
          100: "#d1d1d1",
          200: "#767576"
        },
        dark: {
          100: "#221f3d",
          200: "#0f0d23"
        },
        tab: "#aaa",
        accent: "#AB8BFF"
      },

      fontFamily: {
        montserrat: ["Montserrat_400Regular"],
        "montserrat-medium": ["Montserrat_500Medium"],
        "montserrat-semibold": ["Montserrat_600SemiBold"],
        "montserrat-bold": ["Montserrat_700Bold"],
        "montserrat-extrabold": ["Montserrat_800ExtraBold"],
        "montserrat-black": ["Montserrat_900Black"]
      },

    },
  },
  plugins: [],
  darkMode: "media"
}