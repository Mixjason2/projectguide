// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // ✅ ใช้ 'tailwindcss' ตรงนี้ (ไม่ใช่ '@tailwindcss/postcss')
    autoprefixer: {},
  },
};
export default config;