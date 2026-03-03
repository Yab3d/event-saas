import Booking from '../models/Booking.js';
import TicketTier from '../models/TicketTier.js';
import Event from '../models/Event.js';

/**
 * @desc    Create a new booking and update ticket inventory
 * @route   POST /api/bookings
 * @access  Private (Customer/Admin)
 */
export const createBooking = async (req, res) => {
    try {
        const { eventId, ticketTierId, quantity, referralCodeUsed } = req.body;

        // Verify the Event exists and is approved
        const event = await Event.findById(eventId);
        if (!event || event.status !== 'approved') {
            return res.status(404).json({ message: "Event not found or not available for booking" });
        }

        //  Find the specific Ticket Tier
        const tier = await TicketTier.findById(ticketTierId);
        if (!tier) {
            return res.status(404).json({ message: "Ticket tier not found" });
        }

        //  Check if enough tickets are available
        if (tier.quantityAvailable < quantity) {
            return res.status(400).json({ message: `Only ${tier.quantityAvailable} tickets left for this tier` });
        }

        //Calculations
        const totalAmount = tier.price * quantity;
        const PLATFORM_FEE_PERCENT = 0.05; // 5% fee for the platform
        const platformFeeAmount = totalAmount * PLATFORM_FEE_PERCENT;
        const organizerRevenue = totalAmount - platformFeeAmount;

        // Create the Booking instance
        const booking = new Booking({
            user: req.user._id, // Set by authMiddleware
            event: eventId,
            ticketTier: ticketTierId,
            quantity,
            totalAmount,
            platformFeeAmount,
            organizerRevenue,
            referralCodeUsed: referralCodeUsed || null,
            bookingStatus: 'confirmed' 
        });

        // Subtract the tickets sold
        tier.quantityAvailable -= quantity;

        // Save both to the database
        await tier.save();
        await booking.save();

        res.status(201).json({
            success: true,
            message: "Ticket booked successfully",
            data: booking
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get all bookings for the logged-in user
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('event', 'title date location')
            .populate('ticketTier', 'name price');

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};