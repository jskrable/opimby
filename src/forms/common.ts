export const HONEYPOT = "website";
export const TURNSTILE_FIELD = "cf-turnstile-response";

export const CONTACT_MAX = { name: 100, email: 254, phone: 30 } as const;

// HTML pattern syntax (compiled with the `v` flag), shared by the input and the server.
export const EMAIL_PATTERN = String.raw`[^\s@]+@[^\s@]+\.[^\s@]+`;

export const matchesPattern = (pattern: string, value: string) => new RegExp(`^(?:${pattern})$`, "v").test(value);

export const tooLongMessage = (max: number) => `Must be ${max} characters or fewer`;

export const CONTACT_MESSAGES = {
  name: "Enter your name",
  email: "Enter your email address",
  emailFormat: "Please enter a valid email address like 'name@example.com'",
  phoneFormat: "Please enter a valid phone number like '(215) 555-0123'",
} as const;

export const VERIFY_MESSAGE = "We couldn't check that you're a person. Please try again.";

export const SENDING_LABEL = "Sending";
