import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
  params: {
    folder: "visitor-photos",
  allowed_formats: ["jpg", "png", "jpeg", "webp"],
  transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});
const upload = multer({ storage });
export default upload;
