import { getCategoryString } from "../../../utils/getCategoryString";

export const updatePhotoQuery = (
  photoId: string,
  title: string,
  description: string,
  favorite: string,
  front_page: string,
  categories: string[]
) => {
  const catString = getCategoryString(categories);

  return `UPDATE images SET title = '${title}', description = '${description}', favorite = '${favorite}', front_page = '${front_page}', categories = ARRAY [${catString}] WHERE id = '${photoId}'`;
};
