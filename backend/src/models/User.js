import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["customer", "organizer", "admin"],
        default: "customer"
    },

    isSuspended: {
        type: Boolean,
        default: false
    },

    isVerifiedOrganizer: {
        type: Boolean,

    },

    referralCode: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

//hash password before saving

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
//compare password

userSchema.methods.matchPassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;



