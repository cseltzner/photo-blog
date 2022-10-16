import express from "express";
import pool from "../db/db-connect";
import { getAllPhotosQuery } from "../db/queries/get-all-photos";

/**
 * @route   GET /api/photos/
 * @desc    Get all photos based on query
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
