export const addUserStrings = {
  html_pageTitle: "Add user | Seltzport",
  html_mainHeader: "Add user",

  html_usernameLabel: "Username",
  html_passwordLabel: "Password",
  html_confirmPasswordLabel: "Confirm password",
  html_submitButton: "Add user",

  /**
   * Alert strings
   */

  // Error strings
  alert_passwordNoMatch: "Your passwords do not match!",
  alert_unauthorized: "Unauthorized. Log in and try again",
  alert_userAlreadyExists: (username: string) =>
    `User with username ${username} already exists`,
  alert_miscError: "An error occurred. Try again later",
  alert_connectionError:
    "Connection error. Please check your internet connection and try again",

  // Success strings
  alert_userCreated: "User successfully created!",
};
