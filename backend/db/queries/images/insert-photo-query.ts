import { getCategoryString } from "../../../utils/getCategoryString";

export const insertPhotoQuery = (
  id: string,
  cloudinary_public_id: string,
  title: string,
  description: string,
  img_url: string,
  favorite: string,
  front_page: string,
  categories: string[]
) => {
  const catString = getCategoryString(categories);

  return `INSERT INTO images (id, cloudinary_public_id, title, description, img_url, favorite, front_page, categories)
          VALUES ('${id}', '${cloudinary_public_id}', ${
    title ? `'${title}'` : null
  }, ${
    description ? `'${description}'` : null
  }, '${img_url}', '${favorite}', '${front_page}', ARRAY [${catString}])`;
};
