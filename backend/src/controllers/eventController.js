import Event from "../models/Event.js";
import TicketTier from "../models/TicketTier.js";

export const createEvent = async (req, res) => {
    try {
        const { title, description, category, date, location, tiers } = req.body;

        // 1. Create the Event (Status defaults to 'draft')
        const event = await Event.create({
            title,
            description,
            category,
            date,
            location,
            organizer: req.user._id
        });

        // 2. Create the Ticket Tiers linked to this event
        if (tiers && tiers.length > 0) {
            const tiersWithEventId = tiers.map(tier => ({
                ...tier,
                event: event._id
            }));
            await TicketTier.insertMany(tiersWithEventId);
        }

        res.status(201).json({
            message: "Event and Tiers created successfully",
            event
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};