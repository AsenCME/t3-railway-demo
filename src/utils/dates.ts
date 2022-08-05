import { format } from "date-fns";
import { DATETIME_FORMAT, DATETIME_FORMAT_THIS_YEAR } from "./constants";

export const formatDate = (d: Date | undefined | null): string => {
  if (!d) return "<<unknown>>";
  return format(
    d,
    d.getFullYear() === new Date().getFullYear()
      ? DATETIME_FORMAT_THIS_YEAR
      : DATETIME_FORMAT
  );
};
