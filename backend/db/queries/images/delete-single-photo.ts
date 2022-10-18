export const deleteSinglePhoto = (photoId: string) => {
  return `DELETE FROM images WHERE id = '${photoId}'`;
};
