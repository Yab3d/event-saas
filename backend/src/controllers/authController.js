import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";


const generateReferral = (name = "USER") => {
    const base = name.split(' ')[0] || "USER";
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${base}-${randomStr}`;
};

//register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // If organizer registers, is must not be  verified automatically
        const user = await User.create({
            name,
            email,
            password,
            role: role === "organizer" ? "organizer" : "customer",
            referralCode: generateReferral(name),
            isVerifiedOrganizer: role === "organizer" ? false : undefined
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerifiedOrganizer: user.isVerifiedOrganizer,
            referralCode: user.referralCode,
            token: generateToken(user._id, user.role)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.isSuspended) {
            return res.status(403).json({ message: "Account suspended" });
        }

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerifiedOrganizer: user.isVerifiedOrganizer,
                referralCode: user.referralCode,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};