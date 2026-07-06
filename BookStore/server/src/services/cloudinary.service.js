import { cloudinary } from "../config/cloudinary.js";
import fs from "fs";

/**
 * Upload a file to Cloudinary
 * @param {string} localFilePath
 * @returns {object|null}
 */
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "bookstore",
        });

        // Delete local file after successful upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;
    } catch (error) {
        // Delete local file if upload fails
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        console.error("Cloudinary Upload Error:", error.message);

        return null;
    }
};

export { uploadOnCloudinary };