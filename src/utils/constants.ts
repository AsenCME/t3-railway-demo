export enum CategoryType {
  brand,
  set,
  category,
  class,
}

export const CATEGORY_TYPES = ["brand", "set", "category", "class"];

export const DATETIME_FORMAT = "iii, MMM dd yyyy (HH:mm)";
export const DATETIME_FORMAT_THIS_YEAR = "iii, MMM dd (HH:mm)";
export const DEFAULT_LIMIT = 10;
export const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W){8,16}/;
