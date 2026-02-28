import express from "express";
import { createEvent, updateEvent, getPublicEvents, getEventById } from "../controllers/eventController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", getPublicEvents);
router.get("/:id", getEventById);

router.post("/", protect, authorizeRoles("organizer"), createEvent);

router.put("/:id", protect, authorizeRoles("organizer"), updateEvent)

export default router;