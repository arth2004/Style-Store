import express from "express";
import multer from "multer";
// import path from "path";
const router = express.Router();
import streamifier from "streamifier";
import cloudinary from "../config/cloudinaryConfig.js";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     const extname = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${extname}`);
//   },
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  // const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;
  const originalnameExt = file.originalname.split(".").pop().toLowerCase();

  // if (filetypes.test(extname) && mimetypes.test(mimetype)) {
  if (filetypes.test(originalnameExt) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only (jpeg, png, webp)"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      // res.status(400).send({ message: err.message });
      // Handle multer errors (e.g., file filter error)
      return res.status(400).send({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).send({ message: "No image file provided" });
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder: "stylestore" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res
            .status(500)
            .send({ message: "Error uploading to Cloudinary" });
        }
        if (result) {
          res.status(200).send({
            message: "Image uploaded to Cloudinary successfully",
            image: result.secure_url,
            public_id: result.public_id, //This is useful if want to later delete or manage images
          });
        } else {
          res
            .status(500)
            .send({ message: "Unknown error during Cloudinary upload" });
        }
      }
    );
    // else if (req.file) {
    // res.status(200).send({
    // message: "Image uploaded successfully",
    // image: `/uploads/${req.file.filename}`,
    //   });
    // } else {
    //   res.status(400).send({ message: "No image file provided" });
    // }
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
});

export default router;
