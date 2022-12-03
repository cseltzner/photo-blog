/**
 * Converts an array to a lowercase string to be inserted into a postgres query
 * @param categories - String array to be inserted into a postgres query
 */
export const getCategoryString = (categories: string[]) => {
  let catString = "";
  categories.forEach((category, index) => {
    if (index < categories.length - 1) {
      catString = catString.concat(`'${category.toLowerCase()}'`, ", "); // concats category with comma
    } else {
      catString = catString.concat(`'${category.toLowerCase()}'`); // final category concats without a comma
    }
  });
  return catString;
};
