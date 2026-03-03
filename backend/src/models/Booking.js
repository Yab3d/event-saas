import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    event: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event", 
        required: true 
    },
    ticketTier: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "TicketTier", 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    totalAmount: { type: Number, required: true },
    platformFeeAmount: { type: Number, required: true },
    organizerRevenue: { type: Number, required: true },
    referralCodeUsed: { type: String },
    bookingStatus: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    payment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Payment" 
    }
}, { timestamps: true }); 

export default mongoose.model('Booking', bookingSchema);