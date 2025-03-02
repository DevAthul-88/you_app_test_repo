import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'app-bg': '#09141A',
        'input-bg': '#162329',
        'button-primary': '#24E9A8',
        'text-primary': '#FFFFFF',
        'text-secondary': '#868686',
      },
      height: {
        'screen-safe': '100dvh',
      },
    },
  },
  plugins: [],
}
export default config
