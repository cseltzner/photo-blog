import express from "express";
import multer from "multer";
import {
  deletePhoto,
  getPhoto,
  postPhoto,
  updatePhoto,
} from "../controllers/photoController";
import auth from "../middleware/auth";

// Multer configuration
const maxSize = 10 * 1024 * 1024; // 10mb
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { files: 1, fileSize: maxSize } });

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

/**
 * @route   PUT /api/photo/:photoId
 * @access  Private - Authorization header
 * @desc    Update a photo's title, description, favorite status, front page status, or category array
 *          All parameters to update are optionally passed into the body of the request
 *
 * @params  :photoId - Unique, length 10 alphanumeric ID of the photo to be updated
 *
 * @body    title? - Title to be updated
 * @body    description? - Title to be updated
 * @body    favorite? - Boolean indicating "favorite" status
 * @body    front_page? - Boolean indicating whether photo will have front_page status
 * @body    categories? - Array of strings describing the categories the image belongs to
 */
router.put("/:photoId", auth, updatePhoto);

export default router;
