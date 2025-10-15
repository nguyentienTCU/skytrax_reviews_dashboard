import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviews.js";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

dotenv.config();

const app = express();
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);
app.use(express.json());

if (isProd) {
  app.use(helmet());
  app.use(compression());
} else {
  app.use(cors({
    origin: "http://localhost:3000",
    credentials : true,
  }))
}

// logs
app.use(morgan(isProd ? "combined" : "dev"));

// healthcheck
app.get("/health", (req, res) => res.status(200).send("ok"));

// routes
app.use("/api", reviewRouter);


// 404 + error handling
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: "Internal Server Error" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

