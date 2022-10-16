"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_random_string_1 = __importDefault(require("crypto-random-string"));
/**
 * Generates a random alphanumeric ID of length 10
 * @returns {string} alphanumeric string of length 10
 */
function generateId() {
    (0, crypto_random_string_1.default)({ length: 10, type: "alphanumeric" });
}
exports.default = generateId;
