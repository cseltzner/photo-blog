// @ts-nocheck
// For some reason my IDE is showing a TypeScript error
// on this file even though it compiles, and there is no real error
// Try to remove the nocheck later if my IDE is behaving
export const getLatestFavoritesQuery = (limit: string) => {
  return `SELECT * FROM images WHERE favorite = TRUE ORDER BY date_added DESC LIMIT ${limit}`;
};
