import express from "express";
import multer from "multer";
import {
  deletePhoto,
  getPhoto,
  postPhoto,
} from "../controllers/photoController";
import auth from "../middleware/auth";

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

/**
 * @route   GET /api/photo/:photoId
 * @access  Public
 * @desc    Get single photo by its photoId
 *
 * @params  :photoId - Unique, length 10 alphanumeric ID
 */
router.get("/:photoId", getPhoto);

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
 */
router.post("/", auth, upload.single("image"), postPhoto);

/**
 * @route   DELETE /api/photo/:photoId
 * @access  Private - Authorization header
 * @desc    Delete a single photo by ID
 *
 * @params  :photoId - Unique, length 10 alphanumeric ID of the photo to be deleted
 */
router.delete("/:photoId", auth, deletePhoto);

export default router;
