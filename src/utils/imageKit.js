import ImageKit from "imagekit";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';

dotenv.config();

const imageKit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
});

// function to upload image to ImageKit
const uploadImage = async (localFilePath) => {
    if (!localFilePath) {
        return null;
    }

    try {
        const response = await imageKit.upload({
            file: fs.readFileSync(localFilePath), // required
            fileName: path.basename(localFilePath), // required - pop() is used to get the file name from the path
            folder: "/projects-images/"
        });
        if (response) {
            // delete local file after upload
            fs.unlink(localFilePath, (err) => {
                if (err) {
                    console.error("Error deleting local file:", err);
                } else {
                    console.log("Local file deleted successfully");
                }
            });
        }
        return response;
    } catch (error) {
        console.error("Error uploading image to ImageKit:", error);
        return null;
    }
}

const deleteImage = async (fileId) => {
    if (!fileId) {
        return null;
    }

    try {
        const response = await imageKit.deleteFile(fileId);
        return response;
    } catch (error) {
        console.error("Error deleting image from ImageKit:", error);
        return null;
    }
};

export { uploadImage, deleteImage };