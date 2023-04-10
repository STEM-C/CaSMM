import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

const base = process.env.PUBLIC_URL ?? "/"

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "@primary-color": "#3d5c82", // primary color for all components
          "@link-color": "#3d5c82", // link color
          "@success-color": "#52c41a", // success state color
          "@warning-color": "#faad14", // warning state color
          "@error-color": "#f5222d", // error state color
          "@font-size-base": "14px", // major text font size
          "@heading-color": "rgba(0, 0, 0, 0.85)", // heading text color
          "@text-color": "rgba(0, 0, 0, 0.65)", // major text color
          "@text-color-secondary": "rgba(0, 0, 0, 0.45)", // secondary text color
          "@disabled-color": "rgba(0, 0, 0, 0.25)", // disable state color
          "@border-radius-base": "4px", // major border radius
          "@border-color-base": "#d9d9d9", // major border color
          "@box-shadow-base": "0 2px 8px rgba(0, 0, 0, 0.15)", // major shadow for layers
        },
        javascriptEnabled: true,
      },
    },
  },
  //in build mode, the output will be copoied to server/puiblic/client
  base,
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:1337",
      },
    },
  },
  build: {
    outDir: "build",
  },
})
