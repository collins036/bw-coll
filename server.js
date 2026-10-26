require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, "dist");

app.use(express.json());

// Process a website visit and return the destination URL
app.post("/api/visit", async (req, res) => {
try {
const destination = process.env.DESTINATION_URL;

if (!destination) {
  throw new Error("DESTINATION_URL is not configured");
}

const parsedUrl = new URL(destination);

if (!["http:", "https:"].includes(parsedUrl.protocol)) {
  throw new Error("Invalid destination URL protocol");
}

const visitedAt = new Date().toISOString();

console.log("Website visit:", visitedAt);

return res.json({
  success: true,
  url: parsedUrl.href,
});

} catch (error) {
console.error("Visit processing failed:", error);

return res.status(500).json({
  success: false,
  message: "Unable to process your request.",
});

}
});

// Serve the Vite production build
app.use(express.static(distPath));

// React frontend fallback
app.use((req, res, next) => {
if (req.method !== "GET" || req.path.startsWith("/api/")) {
return next();
}

res.sendFile(path.join(distPath, "index.html"), (error) => {
if (error) {
next(error);
}
});
});

// Handle unknown routes
app.use((req, res) => {
res.status(404).json({
message: "Not found",
});
});

// General error handler
app.use((error, req, res, next) => {
console.error("Server error:", error);

if (res.headersSent) {
return next(error);
}

res.status(500).json({
message: "Internal server error",
});
});

app.listen(PORT, "0.0.0.0", () => {
console.log(`Server running on port ${PORT}`);
});