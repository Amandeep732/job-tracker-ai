import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobLocation: {
        type: String
    },
    notes: {
        type: String
    }, 
    jobTitle: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    jobDesc: {
        type: String,
        required: true,
        trim: true,
    },
    reminderDate: {
        type: Date,
        required: true,
        index: true
    },
    resumeFile: {
        type: String, // this will upload on cloudinary
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["Saved", "Applied", "Rejected"]
    },
    AiSummary: {
        type: String,
        default: ''
    },
    AiTips: {
        type: [String],
        default: []
    },
    AiMatchScore: {
        type: Number,
        default: null
    }

}, { timestamps: true })

export const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);