export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    console.log("=== REQUEST DEBUG ===");
    console.log("req.query:", req.query);
    console.log("req.url:", req.url);

    // Get path segments from query
    const { path } = req.query;

    // Handle root case
    if (!path || path.length === 0) {
      return res.status(200).json({
        message: "Webflow API Proxy is working!",
        usage: "Use /api/webflow/collections/{collectionId}/items",
        timestamp: new Date().toISOString(),
      });
    }

    // Reconstruct the path
    const webflowPath = Array.isArray(path) ? `/${path.join("/")}` : `/${path}`;
    console.log("Webflow path:", webflowPath);

    const webflowUrl = `https://api.webflow.com/v2${webflowPath}`;
    console.log("Final Webflow URL:", webflowUrl);

    const webflowResponse = await fetch(webflowUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer 62ad3ed6e55b0370ab557d5b3d7b5c957afbeed6f158df3303e8fb0e516d0505`,
        "Content-Type": "application/json",
        "accept-version": "1.0.0",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    console.log("Webflow Response Status:", webflowResponse.status);

    const responseData = await webflowResponse.json();
    res.status(webflowResponse.status).json(responseData);
  } catch (error) {
    console.error("Function Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      debug: {
        query: req.query,
        url: req.url,
      },
    });
  }
}
