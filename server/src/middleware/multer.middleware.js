import multer from "multer";
import path from "path";
import { ApiError } from "../utils/ApiError.js";

/**
 * Multer Storage Configuration
 */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/uploads");
    },

    filename: (req, file, cb) => {
        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${path.extname(
                file.originalname
            )}`
        );
    },
});

/**
 * Allow only image files
 */

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;

    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }

    return cb(
        new ApiError(
            400,
            "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
    );
};

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter,
});