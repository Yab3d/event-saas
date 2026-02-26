import mongoose from "mongoose";
import Event from "../models/Event.js";
import TicketTier from "../models/TicketTier.js";

export const createEvent = async (req, res) => {

    //start the session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { title, description, category, date, location, tiers } = req.body;

        // 2. Create Event (Pass the session)
        const event = await Event.create([{
            title,
            description,
            category,
            date,
            location,
            organizer: req.user._id
        }], { session });

        const newEvent = event[0];

        if (tiers && tiers.length > 0) {
            const tiersWithEventId = tiers.map(tier => ({
                ...tier,
                event: newEvent._id
            }));
            await TicketTier.insertMany(tiersWithEventId, { session });
        }


        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Event and Tiers created safely",
            event: newEvent
        });

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        res.status(500).json({ message: "Transaction failed: " + error.message });
    }
}

// adding updating the event functionality
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Find the event
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        //check if the user is the orgnaizer 
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: You do not own this event" });
        }

        // Apply the changes from the request body
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Event updated successfully",
            updatedEvent
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};