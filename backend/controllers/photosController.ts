import express from "express";
import pool from "../db/db-connect";
import { getAllPhotosQuery } from "../db/queries/images/get-all-photos-query";
import { getLatestFavoritesQuery } from "../db/queries/images/get-latest-favorites-query";

/**
 * @route   GET /api/photos/
 * @desc    Get all photos based on query
 * @access  Public
 *
 * @query   category - Category of photograph (eg. 'plant')
 * @query   favorite - Boolean value of photograph's "favorite" status
 * @query   front_page - Boolean value of photograph's "front page" status
 */

export const getAllPhotos = async (
  req: express.Request,
  res: express.Response
) => {
  const { category, favorite, front_page } = req.query;
  const dbQuery = getAllPhotosQuery(
    category?.toString(),
    favorite?.toString(),
    front_page?.toString()
  );

  try {
    const photos = await pool.query(dbQuery);
    res.json(photos.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @route   GET /api/photos/latestfavorite?limit={number}
 * @access  Public
 * @desc    Retrieve {limit} number of images that have the favorite flag. Newest images first
 *
 * @query   limit - number of images to be retrieved
 */
export const getLatestFavorites = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const limit = (req.query.limit as string) || "5";

    const photoQueryRes = await pool.query(getLatestFavoritesQuery(limit));
    res.json(photoQueryRes.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};
