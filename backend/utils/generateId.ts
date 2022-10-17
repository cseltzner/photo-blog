import cryptoRandomString from "crypto-random-string";

/**
 * Generates a random alphanumeric ID of length 10
 * @returns {string} alphanumeric string of length 10
 */
export default function generateId() {
  return cryptoRandomString({ length: 10, type: "alphanumeric" });
}
