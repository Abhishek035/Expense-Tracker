module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',  // Keep xs
        'mantine-breakpoint-sm': '40em',  // 640px - Tailwind sm
        'mantine-breakpoint-md': '48em',  // 768px - Tailwind md
        'mantine-breakpoint-lg': '64em',  // 1024px - Tailwind lg
        'mantine-breakpoint-xl': '80em',  // 1280px - Tailwind xl
      },
    },
  },
};