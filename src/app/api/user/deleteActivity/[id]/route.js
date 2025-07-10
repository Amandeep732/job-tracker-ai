import connectDb from "@/lib/connectDB";
import { Activity } from "@/models/activity.model";
import mongoose from "mongoose";

export async function DELETE(request, { params }) {
    
    if(!params.id) {
        return Response.json(
            { message: "Activity id is missing" }, 
            { status: 400 } 
        );
    }

    try {
        await connectDb();
        const activityId = await params.id;
        console.log(`activity id is ${activityId}`)
        
        if(!mongoose.Types.ObjectId.isValid(activityId)) {
            return Response.json(
                { message: "Invalid activity ID format" },
                { status: 400 }
            );
        }
        console.log(`mongoose check com`)
 

        const response = await Activity.findByIdAndDelete(activityId);
           
        if(!response) {
            return Response.json(
                { message: "Activity not found or already deleted" }, 
                { status: 404 } // Fix 4: Changed to 404 (Not Found)
            );
        }
        console.log(`response sucessfuyy`)
 

        return Response.json(
            { message: "Activity deleted successfully" }, 
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting activity:", error);
        return Response.json(
            { message: "Internal server error" }, 
            { status: 500 }
        );
    }
}