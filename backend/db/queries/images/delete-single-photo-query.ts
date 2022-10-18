export const deleteSinglePhotoQuery = (photoId: string) => {
  return `DELETE FROM images WHERE id = '${photoId}'`;
};
