import { Activity } from "@/models/activity.model"

export const logActivity = async (userId, message) => {
    try {
        await Activity.create({ userId, message })
    } catch (error) {
        console.error("Failed to log activity:", err);
    }
}