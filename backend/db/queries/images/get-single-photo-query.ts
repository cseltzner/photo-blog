export const getSinglePhotoQuery = (photoId: string) => {
  return `SELECT * FROM images WHERE id = '${photoId}'`;
};
