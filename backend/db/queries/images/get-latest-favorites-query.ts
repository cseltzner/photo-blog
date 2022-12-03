export const getLatestFavoritesQuery = (limit: string) => {
  return `SELECT * FROM images WHERE favorite = TRUE ORDER BY date_added DESC LIMIT ${limit}`;
};
