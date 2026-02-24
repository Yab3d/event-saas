import mongoose from "mongoose";

const ticketTierSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true

    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantityAvailable: {
        type: Number,
        required: true
    },
    quantitySold: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const TicketTier = mongoose.model("TicketTier", ticketTierSchema);
export default TicketTier;

