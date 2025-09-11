import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // Proxy all /api/webflow requests to Webflow API
        "/api/webflow": {
          target: "https://api.webflow.com/v2",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/webflow/, ""),
          configure: (proxy, _options) => {
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              // Add authorization header using environment variable
              const token =
                "62ad3ed6e55b0370ab557d5b3d7b5c957afbeed6f158df3303e8fb0e516d0505";
              if (token) {
                proxyReq.setHeader("Authorization", `Bearer ${token}`);
              } else {
                console.error(
                  "❌ No VITE_WEBFLOW_API_TOKEN found in environment"
                );
              }
            });

            proxy.on("error", (err, req, _res) => {
              console.error("❌ Vite Proxy Error:", {
                error: err.message,
                path: req.url,
              });
            });
          },
        },
      },
    },
  };
});
