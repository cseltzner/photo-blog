/**
 * Fetch specific amount of placeholder image urls from
 * jsonplaceholder.typicode.com for testing purposes.
 *
 * @param amount - Amount of photos to fetch
 * @returns - Array of objects with "url" and "thumbnailUrl" property
 */
export const fetchTemplatePhotos = async (amount: number) => {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/photos?_start=0&_limit=" + amount
  );
  const photos = await res.json();
  const urlList: Array<{ url: string; thumbnailUrl: string }> = [];
  photos.forEach((photo) => {
    urlList.push({
      url: photo.url,
      thumbnailUrl: photo.thumbnailUrl,
    });
  });

  return urlList;
};
