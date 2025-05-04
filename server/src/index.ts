import express from "express";
import cors from "cors";
//import { scrapingRoutes } from "./routes/scraping.routes";
import { ENV } from "./config/env.config";
//import { errorHandler } from "./middleware/error.middleware";

console.log("Starting server...");
console.log("Environment:", ENV);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
//app.use("/api/scraping", scrapingRoutes());

// Error handler
//app.use(errorHandler);

// Start server
app.listen(ENV.PORT, () => {
  console.log(`✅ Server running on http://localhost:${ENV.PORT}`);
  console.log("Routes registered:", app._router.stack.length);
});
