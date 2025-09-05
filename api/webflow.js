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
    // Get the full URL path after /api/webflow
    const webflowPath = req.url.replace("/api/webflow", "");

    // If no path provided, return info about the function
    if (!webflowPath || webflowPath === "/") {
      return res.status(200).json({
        message: "Webflow API Proxy is working!",
        usage: "Use /api/webflow/collections/{collectionId}/items",
        timestamp: new Date().toISOString(),
      });
    }

    console.log("webflowPath ", webflowPath);
    const webflowUrl = `https://api.webflow.com/v2${webflowPath}`;

    console.log("Proxying request to:", webflowUrl);
    console.log("Method:", req.method);

    const webflowResponse = await fetch(webflowUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer 62ad3ed6e55b0370ab557d5b3d7b5c957afbeed6f158df3303e8fb0e516d0505`,
        "Content-Type": "application/json",
        "accept-version": "1.0.0",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const responseData = await webflowResponse.json();

    if (!webflowResponse.ok) {
      console.error("Webflow API Error:", responseData);
      return res.status(webflowResponse.status).json(responseData);
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
