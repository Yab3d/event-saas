import Booking from '../models/Booking.js';
import TicketTier from '../models/TicketTier.js';
import Event from '../models/Event.js';
import axios from 'axios';


const generateTxRef = (userId) => `TX-${userId}-${Date.now()}`;

/**
 * @desc    Create a new booking and update ticket inventory
 * @route   POST /api/bookings
 * @access  Private (Customer/Admin)
 */
export const createBooking = async (req, res) => {
    try {
        const { eventId, ticketTierId, quantity } = req.body;

        const event = await Event.findById(eventId);
        const tier = await TicketTier.findById(ticketTierId);

        if (!tier || tier.quantityAvailable < quantity) {
            return res.status(400).json({ message: "Tickets unavailable" });
        }

        const totalAmount = tier.price * quantity;
        const tx_ref = generateTxRef(req.user._id);

        // Prepare Chapa Payload
        const chapaData = {
            amount: totalAmount.toString(),
            currency: "ETB",
            email: req.user.email,
            first_name: req.user.firstName,
            last_name: req.user.lastName,
            tx_ref: tx_ref,
            callback_url: "http://localhost:5000/api/bookings/verify-payment/" + tx_ref,
            return_url: "http://localhost:3000/payment-success", // Frontend URL
            "customization[title]": "Ticket Payment",
            "customization[description]": `Booking for ${event.title}`
        };

        // Initialize Chapa Transaction
        const response = await axios.post(process.env.CHAPA_API_URL, chapaData, {
            headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
        });

        if (response.data.status === "success") {
            // 3. Create "Pending" Booking in our DB
            const booking = new Booking({
                user: req.user._id,
                event: eventId,
                ticketTier: ticketTierId,
                quantity,
                totalAmount,
                platformFeeAmount: totalAmount * 0.05,
                organizerRevenue: totalAmount * 0.95,
                bookingStatus: 'pending',
                paymentReference: tx_ref
            });

            await booking.save();

            // Send the payment link to the user
            res.status(200).json({
                success: true,
                payment_url: response.data.data.checkout_url,
                bookingId: booking._id
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.response?.data?.message || error.message });
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



/**
 * @desc    Get all sales for a specific event (Organizer only)
 * @route   GET /api/bookings/event/:eventId
 * @access  Private (Organizer)
 */
export const getEventSales = async (req, res) => {
    try {
        const { eventId } = req.params;

        //  Check if event exists and belongs to this organizer
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to see these sales" });
        }

        //  Fetch all bookings for this event
        const sales = await Booking.find({ event: eventId })
            .populate('user', 'firstName lastName email')
            .populate('ticketTier', 'name');

        //  Calculate simple stats
        const totalTicketsSold = sales.reduce((acc, curr) => acc + curr.quantity, 0);
        const totalRevenue = sales.reduce((acc, curr) => acc + curr.organizerRevenue, 0);

        res.status(200).json({
            success: true,
            stats: {
                totalTicketsSold,
                totalOrganizerRevenue: totalRevenue
            },
            data: sales
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get all bookings on the platform (Admin only)
 * @route   GET /api/bookings/all
 * @access  Private (Admin)
 */
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'firstName lastName email')
            .populate('event', 'title')
            .populate('ticketTier', 'name price');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



/**
 * @desc    Verify Chapa payment and confirm booking
 * @route   GET /api/bookings/verify-payment/:tx_ref
 * @access  Public (Called by Chapa or Frontend)
 */
export const verifyPayment = async (req, res) => {
    try {
        const { tx_ref } = req.params;

        // Ask Chapa if this transaction is actually PAID
        const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
            headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
        });

        if (response.data.status === "success") {
            const transactionData = response.data.data;

            // Find the pending booking
            const booking = await Booking.findOne({ paymentReference: tx_ref });
            if (!booking) return res.status(404).json({ message: "Booking not found" });

            // If already confirmed, just return success
            if (booking.bookingStatus === 'confirmed') {
                return res.status(200).json({ message: "Booking already confirmed", booking });
            }

            // Update Booking Status
            booking.bookingStatus = 'confirmed';
            await booking.save();

            // Subtract Inventory now that they've ACTUALLY paid
            const tier = await TicketTier.findById(booking.ticketTier);
            if (tier) {
                tier.quantityAvailable -= booking.quantity;
                await tier.save();
            }

            res.status(200).json({
                success: true,
                message: "Payment verified and booking confirmed!",
                booking
            });
        } else {
            res.status(400).json({ message: "Payment verification failed" });
        }
    } catch (error) {
        res.status(500).json({ message: error.response?.data?.message || error.message });
    }
};