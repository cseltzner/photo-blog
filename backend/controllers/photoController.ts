import express from "express";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import pool from "../db/db-connect";
import { getSinglePhoto } from "../db/queries/images/get-single-photo";
import { insertPhoto } from "../db/queries/images/insert-photo";
import generateId from "../utils/generateId";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * @route   GET /api/photo/:photoId
 * @desc    Get single photo by its photoId
 * @access  Public
 *
 * @params  :photoId - Unique, length 10 alphanumeric Id
 */

export const getPhoto = async (req: express.Request, res: express.Response) => {
  const { photoId } = req.params;

  try {
    const response = await pool.query(getSinglePhoto(photoId));
    const photo = response.rows[0];

    res.json(photo);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @route   POST /api/photo
 * @access  Private - Authorization header
 * @desc    Upload a single photo using a FormData element
 *
 * Body is a FormData object on the client side
 * @body    FormData.append("image", ...)
 * @body    FormData.append("categories", JSON.stringify([...])) // JSON.parse() in the server
 * @body    FormData.append("favorite", bool)
 * @body    FormData.append("front_page", bool)
 * @body    FormData.append("title", string) // Required if favorite is true
 * @body    FormData.append("description", string) // Required if favorite is true
 *
 * @status  200 - Upload success - returns {message, url}
 * @status  400 - Bad request
 * @status  500 - Error uploading file
 */
export const postPhoto = (req: express.Request, res: express.Response) => {
  const image = req.file;
  const categories = req.body.categories ? JSON.parse(req.body.categories) : [];
  const favorite = req.body.favorite || "false";
  const front_page = req.body.front_page || "false";
  const title = req.body.title;
  const description = req.body.description;

  if (!image) {
    return res
      .status(400)
      .json({ message: "Bad request, check request and try again." });
  }

  if (favorite == "true" && (!title || !description)) {
    return res
      .status(400)
      .json({ message: "Bad request, check request and try again." });
  }

  try {
    const cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: process.env.CLOUDINARY_UPLOAD_FOLDER_NAME },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Error uploading file" });
        }
        // If upload succeeds, add photo to database
        await pool.query(
          insertPhoto(
            generateId(),
            title,
            description,
            result?.secure_url!,
            favorite,
            front_page,
            categories
          )
        );
        return res.json({ message: "Upload success", url: result?.secure_url });
      }
    );
    streamifier.createReadStream(image.buffer).pipe(cld_upload_stream);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error uploading file" });
  }
};
