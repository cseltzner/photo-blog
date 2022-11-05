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
  const descString = description.replace("'", "''");
  const titleString = title.replace("'", "''");
  const catString = getCategoryString(categories);

  return `INSERT INTO images (id, cloudinary_public_id, title, description, img_url, favorite, front_page, categories)
          VALUES ('${id}', '${cloudinary_public_id}', ${
    title ? `'${titleString}'` : null
  }, ${
    description ? `'${descString}'` : null
  }, '${img_url}', '${favorite}', '${front_page}', ${
    categories.length > 0 ? `ARRAY [${catString}]` : "NULL"
  })`;
};
