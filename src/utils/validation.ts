import { string } from "yup";
import { PASSWORD_REGEX } from "./constants";

export const PASSWORD_SCHEMA = string().matches(
  PASSWORD_REGEX,
  "Password must be between 6 and 16 digits and contain at least 1 uppercase character, 1 lowercase character, 1 digit and one special characte"
);
