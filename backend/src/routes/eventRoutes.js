import express from "express";
import { createEvent } from "../controllers/eventController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("organizer"), createEvent);

export default router;