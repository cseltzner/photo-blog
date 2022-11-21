export const uploadImageStrings = {
  maxFileSize: 1_000_000 * 10,

  // Test id's
  html_categoriesListItemTestId: "categories-list-item",
  html_categoriesLabelTestId: "categories-list-item-label",
  html_sessionUploadLiTestId: "session-upload-li",

  html_pageTitle: "Upload image | SeltzPort",
  html_mainHeader: "Upload photo",

  html_imgLabel: "Upload photo icon",

  html_categoriesHeader: "Categories",
  html_favoriteLabel: "Favorite",
  html_frontPageLabel: "Front page",

  html_titleLabel: "Title",
  html_invalidTitleError: "Favorite photos must have a title",

  html_descriptionLabel: "Description",
  html_invalidDescriptionError: "Favorite photos must have a description",

  html_submitButton: "Add Photo",

  html_uploadHint: "Upload",

  html_noFileError: "No file selected...",
  html_fileSizeTooLargeError: "File must be smaller than 10MB",

  html_filesUploadedText: "Files uploaded this session",

  /**
   * Alert strings
   */

  // Error alerts
  alert_badRequest: "Bad request. Please check your file and try again",
  alert_serverError: "Server error. Please try again later",
  alert_networkError:
    "An error occurred. Please check your internet connection and try again",
  alert_unauthorized:
    "You must be logged in as an administrator to upload a photo!",

  // Success alerts
  alert_photoUploadTitle: "Photo uploaded",
  alert_photoUpload: "Your photo has been successfully uploaded",
};
