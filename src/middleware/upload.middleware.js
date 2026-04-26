import { upload } from "../config/cloudinary.js";

export const uploadSingle = upload.single('image');

export const handlerUploadError = (err, req, res, next) => {
    if(err){
        return res.status(400).json({ error: err.message });
    }
    next();
}