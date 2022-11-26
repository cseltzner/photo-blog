/**
 * Adds transformation parameters to a cloudinary url
 *
 * @param link - Cloudinary url to add transformations to
 * @param width - Set width transformation in px
 * @param height - Set height transformation in px
 */
export const transformLink = (
  link: string,
  width?: number,
  height?: number
) => {
  if (!width && !height) return link;

  try {
    const transformationArr: Array<string> = [];
    width && transformationArr.push(`w_${width}`);
    height && transformationArr.push(`h_${height}`);
    const transformationString = transformationArr.join(",");

    const linkArr = link.split("/");

    // Throws if not enough url splits
    if (linkArr.length < 6) {
      throw new Error();
    }

    linkArr.splice(6, 0, transformationString);
    return linkArr.join("/");
  } catch (err) {
    throw new Error("Invalid link to be transformed");
  }
};
