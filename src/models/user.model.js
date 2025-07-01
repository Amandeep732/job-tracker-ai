import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        index: true
    },
    fullName: {
        type: String,
        //required: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        set: val => String(val)
    },
    refreshToken: {
        type: String
    },
}, { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model("User", userSchema);
