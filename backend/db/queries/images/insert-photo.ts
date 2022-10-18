export const insertPhoto = (
  id: string,
  cloudinary_public_id: string,
  title: string,
  description: string,
  img_url: string,
  favorite: string,
  front_page: string,
  categories: string[]
) => {
  let catString = "";
  categories.forEach((category, index) => {
    if (index < categories.length - 1) {
      catString = catString.concat(`'${category}'`, ", ");
    } else {
      catString = catString.concat(`'${category}'`);
    }
  });

  return `INSERT INTO images (id, cloudinary_public_id, title, description, img_url, favorite, front_page, categories)
          VALUES ('${id}', '${cloudinary_public_id}', ${
    title ? `'${title}'` : null
  }, ${
    description ? `'${description}'` : null
  }, '${img_url}', '${favorite}', '${front_page}', ARRAY [${catString}])`;
};
