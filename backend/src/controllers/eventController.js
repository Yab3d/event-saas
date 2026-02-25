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
};