import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
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

userSchema.methods.isPasswordCorrect = async function(password) {
   return await bcrypt.compare(password, this.password)
}
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10);
    next()
})



export const User = mongoose.models.User || mongoose.model("User", userSchema);
