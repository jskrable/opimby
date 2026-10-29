const TIME_ZONE = "America/New_York";

const full = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, dateStyle: "medium", timeStyle: "short" });
const day = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, month: "short", day: "numeric" });
const shortWithYear = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric", month: "short", day: "numeric" });
const year = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric" });

// D1 stores UTC as "YYYY-MM-DD HH:MM:SS".
const parse = (utc: string) => new Date(`${utc.replace(" ", "T")}Z`);

export const formatSubmitted = (utc: string) => full.format(parse(utc));

// Lists show the day only; the time is on the detail page.
export function formatSubmittedDay(utc: string) {
  const date = parse(utc);
  return year.format(date) === year.format(new Date()) ? day.format(date) : shortWithYear.format(date);
}

export const truncate = (text: string, max = 80) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);
