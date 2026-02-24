import express from "express";
import { createEvent } from "../controllers/eventController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, authorizeRoles("organizer"), createEvent);

export default router;