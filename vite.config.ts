import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"

export default defineConfig(env => ({
    plugins: [react()],
    base: env.mode === "production" ? "/For-My-Sister" : ""
}));
