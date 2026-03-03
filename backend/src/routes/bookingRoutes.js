import express from 'express';
import { createBooking, getMyBookings, getEventSales, getAllBookings } from '../controllers/bookingController.js';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
//customer routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);

//orgainzer routes
router.get('/event/:eventId', protect, getEventSales);


//Admin routes
router.get('/all', protect, authorizeRoles('admin'), getAllBookings);



export default router;