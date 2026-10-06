import { AsYouType, getCountryCallingCode, isPossiblePhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js/min";

const DEFAULT_COUNTRY = "US";

const parse = (value: string) => parsePhoneNumberFromString(value, DEFAULT_COUNTRY);

// Length only: isValid() rejects real numbers missing from libphonenumber's metadata.
export const isValidPhone = (value: string) => isPossiblePhoneNumber(value, DEFAULT_COUNTRY);

// Expects a value that passed isValidPhone.
export const toE164 = (value: string) => parse(value)!.number;

export const formatAsYouType = (value: string) => new AsYouType(DEFAULT_COUNTRY).input(value);

export function displayPhone(e164: string) {
  const phone = parse(e164);
  if (!phone) return e164;
  const local = phone.countryCallingCode === getCountryCallingCode(DEFAULT_COUNTRY);
  return local ? phone.formatNational() : phone.formatInternational();
}
