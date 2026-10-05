/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // Development: allow all patterns
    ...(process.env.NODE_ENV === 'development' ? [{ pattern: /.*/ }] : []),
    'bg-slate-50',
    'bg-slate-500',
    'border-slate-200',
    'bg-slate-300',
    'text-slate-600',

    'bg-green-50',
    'bg-green-500',
    'border-green-200',
    'bg-green-300',
    'text-green-600',
    'bg-blue-50',
    'bg-blue-500',
    'border-blue-200',
    'bg-blue-300',
    'text-blue-600',
    'bg-orange-50',
    'bg-orange-500',
    'border-orange-200',
    'bg-orange-300',
    'text-orange-600',
    'w-full',
    'h-full'
  ],
  theme: {
    extend: {
      fontSize: {
        'base': '1.1875rem', // 19px
        'sm': '1.125rem',    // 18px
        'lg': '1.3125rem',  // 21px
        'xl': '1.4375rem',   // 23px

        '2xl': ['1.5rem', '1.25'],
        '3xl': ['1.875rem', '1.25'],
        '4xl': ['2.25rem', '1.25'],
        '5xl': ['2.75rem', '1.25'],
        '6xl': ['3.5rem', '1.25'],
        '7xl': ['4.75rem', '1.25'],
        '8xl': ['5.5rem', '1.25'],
        '9xl': ['7rem', '1.25'],
      },
      fontFamily: {
        barlow: ['Barlow', 'IranYekan'],
        condensed: ['Markazi'],
        sans: ['IranYekan', 'Barlow'],
        header: ['Gilda Display', 'Markazi']
      },
      colors: {
        primary: '#AA8453',
        whiteGold: '#F8F5F0',
        darkGold: '#e8decd',
        tableHeader: '#DDCEBA',
        customBlue: '#35427D',
        grayCheckBox: '#939393',
        grayLabel: "#636260",
        grayDark: "#222222B2"
      },
      fontSize: {
        'base': '19px',
        'sm': '17px',
        'lg': '21px',
        'xl': '23px'
      },
      maxWidth: {
        'responsive': 'clamp(280px, 92vw, 1400px)',
        // Mobile breakpoints
        'container-xxs':'250px',    // small phones (320-480px)
        'container-xs': '300px',    // small phones (320-480px)
        'container-sm': '400px',    // large phones (480-640px)
        // Tablet breakpoints  
        'container-md': '500px',    // small tablets (640-768px)
        'container-lg': '680px',    // large tablets (768-1024px)
        // Desktop breakpoints
        'container-xl': '800px',   // small desktop (1024-1280px)
        'container-2xl': '980px',  // medium desktop (1280-1536px)
        'container-3xl': '1120px',  // large desktop (1536-1792px)
        'container-4xl': '1260px',  // extra large desktop (1792px+)
        'container-max': '1400px',  // full HD screens
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: false, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: false, // dark theme is disabled now. to enable it set darkTheme as: dark.
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: true, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
};