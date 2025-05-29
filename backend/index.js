// packages
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cors from "cors";

dotenv.config();
const port = process.env.port || 5000;

connectDB();

const app = express();
const allowedOrigins = [
  "https://style-store-nine.vercel.app",
  "http://localhost:3000", // local React dev
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const __dirname = path.resolve();
console.log(__dirname);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.get("/test-image", (req, res) => {
  res.sendFile(path.join(__dirname, "../uploads/image-1748505742782.jpg"));
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(port, console.log(`Server running on port: ${port}`));
