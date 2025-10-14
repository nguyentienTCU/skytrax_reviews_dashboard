import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviews.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use("/api", reviewRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

