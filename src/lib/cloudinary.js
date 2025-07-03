import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// there is 3 steps to perform cloudinary
// 1 is resume upload on server 
// 2 get resume file from server and upload on cloudinary
// 3 get resume link from clodinary


export const uploadOnCloudinary = async function (filePath) {
    try {
        if (!filePath) {
            return NextResponse.json({ error: "file path is missing" }, { status: 404 })
        }
        console.log(`your file path is :${filePath}`)

        const response = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });
        console.log("file is uploaded on cloudinary ", response.url);

        fs.unlinkSync(filePath);
        return response
    } catch (error) {
        console.error("❌ Cloudinary upload failed:", error);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return null;
    }
}
