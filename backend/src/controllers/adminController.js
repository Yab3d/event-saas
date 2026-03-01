import Event from "../models/Event.js";
import User from "../models/User.js";


export const reviewEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        //only allowing approved or rejected 

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }
        //find and update the event 

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found "
            });
        }
        event.status = status;

        if (status === 'rejected') {
            event.rejectionReason = rejectionReason;

        } else {
            event.rejectionReason = undefined;
        }

        await event.save();

        res.status(200).json({
            message: `Event has been ${status}`,
            event
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//get all the pending events for the ADMIN dashboard 

export const getPendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: "pending" }).populate("organizer", "name email");
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    };
};


export const verifyOrganizer = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user || user.role !== 'organizer') {
            return res.status(404).json({ message: "organizer not found" });

        }
        user.isVerifiedOrganizer = true;
        await user.save();
        res.status(200).json({ message: "organizer is now verifed and trusted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


}


