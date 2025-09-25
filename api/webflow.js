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
    console.log("=== SIMPLE FUNCTION DEBUG ===");
    console.log("req.url:", req.url);
    console.log("req.query:", req.query);

    // Get the path from the 'path' query parameter (set by vercel.json rewrite)
    const pathParam = req.query.path;

    // Handle root case
    if (!pathParam) {
      return res.status(200).json({
        message: "Webflow API Proxy is working!",
        usage: "Use /api/webflow/collections/{collectionId}/items",
        timestamp: new Date().toISOString(),
      });
    }

    // Construct the Webflow path
    const webflowPath = `/${pathParam}`;
    console.log("webflowPath:", webflowPath);

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

    const status = webflowResponse.status;

    if (status === 204) {
      // No content by spec → just return 204
      return res.status(204).end();
    }

    let responseData = null;
    try {
      // Only parse JSON if body exists
      const text = await webflowResponse.text();
      responseData = text ? JSON.parse(text) : null;
    } catch (err) {
      console.warn("No JSON body returned:", err.message);
    }

    if (responseData !== null) {
      res.status(webflowResponse.status).json(responseData);
    } else {
      // For 204 responses, return an empty object
      res.status(webflowResponse.status).end();
    }
  } catch (error) {
    console.error("Function Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      debug: {
        url: req.url,
        query: req.query,
      },
    });
  }
}
