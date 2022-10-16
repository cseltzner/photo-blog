import express from "express";
import { getPhoto } from "../controllers/photoController";

const router = express.Router();

/**
 * @route   GET /api/photo/:photoId
 * @access  Public
 * @desc    Get single photo by its photoId
 *
 * @params  :photoId - Unique, length 10 alphanumeric Id
 */
router.get("/:photoId", getPhoto);

export default router;
