import { AsYouType, getCountryCallingCode, isPossiblePhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js/min";

const DEFAULT_COUNTRY = "US";

const parse = (value: string) => parsePhoneNumberFromString(value, DEFAULT_COUNTRY);

// Length check only. Full validation (isValid) rejects real numbers missing from the metadata
// and blocks submitting; we only need a number we can call back.
export const isValidPhone = (value: string) => isPossiblePhoneNumber(value, DEFAULT_COUNTRY);

// E.164, e.g. +12155550123. Only call on values that passed isValidPhone.
export const toE164 = (value: string) => parse(value)!.number;

export const formatAsYouType = (value: string) => new AsYouType(DEFAULT_COUNTRY).input(value);

export function displayPhone(e164: string) {
  const phone = parse(e164);
  if (!phone) return e164;
  const local = phone.countryCallingCode === getCountryCallingCode(DEFAULT_COUNTRY);
  return local ? phone.formatNational() : phone.formatInternational();
}
