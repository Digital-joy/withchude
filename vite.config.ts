import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import createExternal from "vite-plugin-external"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    define: {
      "process.env.STRIPE_PUBLISHABLE_KEY": JSON.stringify(env.STRIPE_PUBLISHABLE_KEY),
      "process.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL),
      "process.env.SUPABASE_ANON_KEY": JSON.stringify(env.SUPABASE_ANON_KEY),
      "process.env.SERVER_URL": JSON.stringify(env.SERVER_URL),
      "process.env.APP_URL": JSON.stringify(env.APP_URL),
      "process.env.MIGRATION_DOMAIN": JSON.stringify(env.MIGRATION_DOMAIN),
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
    },
    build: {
      rollupOptions: {
        external: "babel-runtime/regenerator",
      },
    },
    plugins: [
      react(),
      createExternal({
        externals: {
          "babel-runtime/regenerator": "babel-runtime/regenerator",
        },
      }),
    ],
    ssr: {
      noExternal: ["react-helmet-async"],
    },
  }
})
