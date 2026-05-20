import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  { ignores: [".next/**", "node_modules/**", "out/**", "assets/**"] },
  ...nextVitals
];

export default config;
