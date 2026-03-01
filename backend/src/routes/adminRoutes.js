import express from "express";
import { reviewEvent, getPendingEvents, verifyOrganizer } from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";


const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/pending", getPendingEvents);
router.put("/review/:id", reviewEvent);
router.put("/verify-organizer/:userId", verifyOrganizer)

export default router;