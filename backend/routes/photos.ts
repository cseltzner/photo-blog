import express from "express";
import { getAllPhotos } from "../controllers/photosController";

const router = express.Router();

/**
 * @route   GET /api/photos/
 * @access  Public
 * @desc    Get all photos based on query
 *
 * @query   category - Category of photograph (eg. 'plant')
 * @query   favorite - Boolean value of photograph's "favorite" status
 * @query   front_page - Boolean value of photograph's "front page" status
 */
router.get("/", getAllPhotos);

export default router;
