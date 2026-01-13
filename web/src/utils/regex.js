/**
 * Regular expression patterns used for input validation throughout the application.
 * These patterns ensure that IDs, filenames, usernames, and other inputs meet specific security and format requirements.
 * @const {Object.<string, RegExp>}
 */
const Regex = {
  /** Pattern for UUID validation (8-4-4-4-12 hex format). */
  id: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /** Pattern for filenames (1-256 chars, no slashes or newlines). */
  filename: /^[^/\r\n]{1,256}$/,
  /** Allow all. */
  filecontent: {test: () => true},
  /** Pattern for usernames (2-32 chars, alphanumeric/dots/dashes/underscores, no double dots). */
  username: /^(?!.*\.\.)[A-Za-z\d_\.\- ]{2,32}$/,
  /** Pattern for passwords (8-64 characters). */
  password: /^.{8,64}$/,
  /** Pattern for Base64 image strings (png, jpeg, jpg, webp). */
  image: /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/,
  /** Pattern for user descriptions (0-512 characters). */
  description: /^.{0,512}$/,
};

module.exports = Regex;
