import { DateTime } from "luxon"

export const dateIsValid = (day: number, month: number, year: number) =>
  day <= 31 && month <= 12 && year <= DateTime.now().year
