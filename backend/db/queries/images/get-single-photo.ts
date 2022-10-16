export const getSinglePhoto = (photoId: string) => {
  return `SELECT * FROM images WHERE id = '${photoId}'`;
};
