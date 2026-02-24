import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String
    },

    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    legalDocumentUrl: { type: String },
    status: {
        type: String,
        enum: ["draft", "pending", "approved", "rejected", "published"],
        default: "draft"
    },
    rejectionReason: { type: String },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalTicketsSold: { type: Number, default: 0 }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;