import express from "express";
import {
  getAllPhotos,
  getLatestFavorites,
} from "../controllers/photosController";

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

/**
 * @route   GET /api/photos/latestfavorite?limit={number}
 * @access  Public
 * @desc    Retrieve {limit} number of images that have the favorite flag. Newest images first
 *
 * @query   limit - number of images to be retrieved
 */
router.get("/latestfavorite", getLatestFavorites);

export default router;
