import { convertLegacyToken } from "@ant-design/compatible"
import react from "@vitejs/plugin-react"
import { theme } from "antd/lib"
import { defineConfig } from "vite"
const { defaultAlgorithm, defaultSeed } = theme

const mapToken = defaultAlgorithm({
  ...defaultSeed,
  colorPrimary: "#3d5c82",
  colorSuccess: "#52c41a",
  colorWarning: "#faad14",
})
const v4Token = convertLegacyToken(mapToken)

const base = process.env.PUBLIC_URL ?? "/"

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: v4Token,
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
