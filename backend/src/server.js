import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import eventRoutes from "./routes/eventRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);


app.get("/api/test/protected", protect, (req, res) => {
    res.json({ message: "Protected route accessed", user: req.user });
});
connectDB();

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("server is running");
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});


