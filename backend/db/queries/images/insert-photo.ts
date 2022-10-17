export const insertPhoto = (
  id: string,
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
      catString.concat(category, ", ");
    } else {
      catString.concat(category);
    }
  });

  return `INSERT INTO images (id, title, description, img_url, favorite, front_page, categories)
          VALUES ('${id}', ${title ? `'${title}'` : null}, ${
    description ? `'${description}'` : null
  }, '${img_url}', '${favorite}', '${front_page}', ARRAY [${catString}])`;
};
