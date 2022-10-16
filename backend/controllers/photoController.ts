import express from "express";
import pool from "../db/db-connect";
import { getSinglePhoto } from "../db/queries/get-single-photo";

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
