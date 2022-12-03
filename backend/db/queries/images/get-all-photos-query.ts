export const getAllPhotosQuery = (
  category?: string,
  favorite?: string,
  front_page?: string
) => {
  const selectStmt = "SELECT * FROM images";
  const queries = {
    category,
    favorite,
    front_page,
  };

  if (!queries.category && !queries.favorite && !queries.front_page) {
    return selectStmt;
  }

  const categoryClause = category
    ? `'${category}' = ANY (categories)`
    : "1 = 1";
  const favoriteClause = favorite
    ? `favorite = ${favorite}`
    : "favorite = favorite";
  const front_pageClause = front_page
    ? `front_page = ${front_page}`
    : "front_page = front_page";
  const whereStmt = `WHERE `.concat(
    categoryClause,
    " AND ",
    favoriteClause,
    " AND ",
    front_pageClause
  );
  const orderStmt = "ORDER BY date_added DESC";

  return selectStmt.concat(" ", whereStmt, " ", orderStmt);
};
